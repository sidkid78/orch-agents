import 'server-only';
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { TaskPlan, Subtask } from '../types';

const getAi = (apiKeyOverride?: string): GoogleGenAI => {
    const apiKey = apiKeyOverride || process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey });
};

const taskPlanSchema = {
    type: Type.OBJECT,
    properties: {
        task_understanding: {
            type: Type.STRING,
            description: "A detailed summary of the overall task and its main goals based on the user's query."
        },
        subtasks: {
            type: Type.ARRAY,
            description: "An array of all the subtasks required to fulfill the user's query.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: {
                        type: Type.STRING,
                        description: "A unique identifier for the subtask, e.g., 'subtask_1'."
                    },
                    title: {
                        type: Type.STRING,
                        description: "A brief, descriptive title for the subtask."
                    },
                    description: {
                        type: Type.STRING,
                        description: "A detailed description of what the subtask involves and what the worker needs to do."
                    },
                    required_expertise: {
                        type: Type.STRING,
                        description: "The type of expertise or agent persona needed for this subtask (e.g., 'Data Analyst', 'Creative Writer', 'Code Generator')."
                    },
                    priority: {
                        type: Type.INTEGER,
                        description: "The execution priority of the subtask (1 being the highest)."
                    },
                    dependencies: {
                        type: Type.ARRAY,
                        description: "An array of subtask IDs that must be completed before this one can start.",
                        items: {
                            type: Type.STRING
                        }
                    }
                },
                required: ["id", "title", "description", "required_expertise", "priority", "dependencies"]
            }
        },
        execution_strategy: {
            type: Type.STRING,
            description: "A description of the overall strategy for executing the subtasks, including how they relate to each other."
        }
    },
    required: ["task_understanding", "subtasks", "execution_strategy"]
};


export const generateTaskPlan = async (userQuery: string, apiKeyOverride?: string): Promise<TaskPlan> => {
    const prompt = `You are a world-class AI orchestrator. Your job is to analyze a complex user query and break it down into a structured plan of subtasks. Other specialized AI agents will execute these subtasks.

    User Query: "${userQuery}"

    Create a detailed plan by defining the overall task understanding, a list of subtasks with their dependencies and required expertise, and an overall execution strategy. Ensure subtask IDs are unique and dependencies are correctly referenced. For the 'required_expertise' field, suggest a specific role for an AI agent.`;

    const response = await getAi(apiKeyOverride).models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: taskPlanSchema,
            temperature: 0.2,
        },
    });

    try {
        const text = response.text ?? '';
        const jsonText = text.trim();
        return JSON.parse(jsonText) as TaskPlan;
    } catch (e) {
        console.error("Failed to parse task plan JSON:", e);
        throw new Error("Could not generate a valid task plan. The model response was not valid JSON.");
    }
};

export const executeSubtask = async (
    userQuery: string,
    taskUnderstanding: string,
    subtask: Subtask,
    dependencyResults: Record<string, string>,
    apiKeyOverride?: string
): Promise<string> => {
    let dependencyContext = "";
    if (subtask.dependencies.length > 0) {
        dependencyContext = "You must use the results from the following completed subtasks as context for your work:\n\n";
        for (const depId of subtask.dependencies) {
            dependencyContext += `--- RESULT FROM SUBTASK ${depId} ---\n${dependencyResults[depId] || "No result available."}\n\n`;
        }
    }

    const prompt = `You are a specialized AI agent, an expert ${subtask.required_expertise}. Your task is to execute a specific subtask as part of a larger plan.

    Original User Query: "${userQuery}"
    Overall Task Goal: "${taskUnderstanding}"

    ${dependencyContext}
    --- YOUR CURRENT SUBTASK ---
    Title: ${subtask.title}
    Description: ${subtask.description}
    
    Execute this subtask now. Provide a concise but complete response that directly fulfills the subtask description. Focus ONLY on your assigned subtask.`;

    const response: GenerateContentResponse = await getAi(apiKeyOverride).models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            temperature: 0.5,
        },
    });
    
    return response.text ?? '';
};

export const synthesizeResults = async (
    userQuery: string,
    taskPlan: TaskPlan,
    subtaskResults: Record<string, string>,
    apiKeyOverride?: string
): Promise<string> => {
    
    const formattedResults = taskPlan.subtasks.map((st: Subtask) => 
        `--- SUBTASK: ${st.title} (${st.required_expertise}) ---\nRESULT:\n${subtaskResults[st.id] || "No result available."}`
    ).join("\n\n");

    const prompt = `You are a world-class AI synthesizer. Your job is to integrate the results from multiple specialized AI agents into a single, cohesive, and comprehensive final response for the user.

    Original User Query: "${userQuery}"
    Overall Task Plan: "${taskPlan.task_understanding}"

    The individual subtask results are as follows:
    ${formattedResults}

    Synthesize these results into a final, well-structured, and easy-to-read response. Address the user's original query directly. Do not just list the results; integrate them intelligently.`;

    const response: GenerateContentResponse = await getAi(apiKeyOverride).models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            temperature: 0.7,
        }
    });

    return response.text ?? '';
};