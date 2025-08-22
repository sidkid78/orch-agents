"use client";

import React, { useState, useCallback, useEffect } from 'react';
import Header from '../components/Header';
import QueryInput from '../components/QueryInput';
import OrchestratorView from '../components/OrchestratorView';
import SynthesizerView from '../components/SynthesizerView';
import { TaskPlan, Subtask, SubtaskResult, SubtaskResults, SubtaskStatus, LoadingStates } from '../types';

const App: React.FC = () => {
    const [userQuery, setUserQuery] = useState<string>('');
    const [taskPlan, setTaskPlan] = useState<TaskPlan | null>(null);
    const [subtaskResults, setSubtaskResults] = useState<SubtaskResults>({});
    const [finalResponse, setFinalResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState<LoadingStates>({ planning: false, executing: false, synthesizing: false });
    const [error, setError] = useState<string | null>(null);

    const isWorkflowRunning = loading.planning || loading.executing || loading.synthesizing;

    const resetState = () => {
        setUserQuery('');
        setTaskPlan(null);
        setSubtaskResults({});
        setFinalResponse(null);
        setError(null);
        setLoading({ planning: false, executing: false, synthesizing: false });
    };

    const handleExecuteWorkflow = async (query: string) => {
        resetState();
        setUserQuery(query);
        setError(null);
        setLoading((prev: LoadingStates) => ({ ...prev, planning: true }));

        try {
            const planRes = await fetch('/api/plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });
            if (!planRes.ok) {
                const text = await planRes.text();
                throw new Error(text || 'Failed to generate plan');
            }
            const plan: TaskPlan = await planRes.json();
            setTaskPlan(plan);

            // Initialize subtask statuses
            const initialResults: SubtaskResults = {};
            plan.subtasks.forEach((st: Subtask) => {
                initialResults[st.id] = { status: SubtaskStatus.PENDING, result: null };
            });
            setSubtaskResults(initialResults);
            
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred during planning.');
            setLoading({ planning: false, executing: false, synthesizing: false });
        } finally {
            setLoading((prev: LoadingStates) => ({...prev, planning: false }));
        }
    };

    const executeSubtasks = useCallback(async () => {
        if (!taskPlan) return;
    
        setLoading((prev: LoadingStates) => ({ ...prev, executing: true }));
        let remainingTasks: Subtask[] = [...taskPlan.subtasks];
        const currentResults: SubtaskResults = { ...subtaskResults };
        const newSubtaskResultsState: SubtaskResults = { ...subtaskResults };
    
        while (remainingTasks.length > 0) {
            const executableTasks = remainingTasks.filter((task: Subtask) =>
                task.dependencies.every((depId: string) =>
                    newSubtaskResultsState[depId]?.status === SubtaskStatus.COMPLETED
                )
            );
    
            if (executableTasks.length === 0 && remainingTasks.length > 0) {
                 setError("Circular dependency or failed dependency detected. Halting execution.");
                 setLoading((prev: LoadingStates) => ({ ...prev, executing: false }));
                 return;
            }

            // Set executable tasks to In Progress
            executableTasks.forEach((task: Subtask) => {
                newSubtaskResultsState[task.id] = { ...newSubtaskResultsState[task.id], status: SubtaskStatus.IN_PROGRESS };
            });
            setSubtaskResults({ ...newSubtaskResultsState });

            const taskPromises = executableTasks.map((task: Subtask) =>
                fetch('/api/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userQuery,
                        taskUnderstanding: taskPlan.task_understanding,
                        subtask: task,
                        dependencyResults: Object.fromEntries(
                            Object.entries(currentResults as Record<string, SubtaskResult>).map(([key, value]: [string, SubtaskResult]) => [key, value.result || ''])
                        )
                    })
                })
                .then(async (res) => {
                    if (!res.ok) {
                        const text = await res.text();
                        throw new Error(text || 'Failed to execute subtask');
                    }
                    const data = await res.json();
                    return { task, result: data.result as string };
                })
                .catch((err: unknown) => ({ task, result: `Error: ${err instanceof Error ? err.message : String(err) }`, error: true }))
            );

            const completedTasks = await Promise.all(taskPromises);

            completedTasks.forEach((completedTask: { task: Subtask; result: string; error?: boolean }) => {
                const { task, result } = completedTask;
                const taskError = 'error' in completedTask && completedTask.error;
                const status = taskError ? SubtaskStatus.FAILED : SubtaskStatus.COMPLETED;
                newSubtaskResultsState[task.id] = { status, result };
                currentResults[task.id] = { status, result };
            });

            setSubtaskResults({ ...newSubtaskResultsState });
    
            remainingTasks = remainingTasks.filter(task =>
                !executableTasks.some(et => et.id === task.id)
            );
        }
    
        setLoading((prev: LoadingStates) => ({ ...prev, executing: false }));
        // Trigger synthesis after execution
        setLoading((prev: LoadingStates) => ({ ...prev, synthesizing: true }));

    }, [taskPlan, userQuery, subtaskResults]);

    useEffect(() => {
        if (taskPlan && !loading.planning && !isWorkflowRunning) {
            executeSubtasks();
        }
    }, [taskPlan, executeSubtasks, loading.planning, isWorkflowRunning]);
    

    const synthesizeFinalResponse = useCallback(async () => {
        if (!taskPlan) return;

        const finalSubtaskResults: SubtaskResults = { ...subtaskResults };

        const resultsForSynthesis: Record<string, string> = {};
        for (const subtask of taskPlan.subtasks) {
            resultsForSynthesis[subtask.id] = finalSubtaskResults[subtask.id]?.result || "No result generated.";
        }

        try {
            const res = await fetch('/api/synthesize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userQuery, taskPlan, subtaskResults: resultsForSynthesis })
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to synthesize');
            }
            const data = await res.json();
            setFinalResponse(data.result as string);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred during synthesis.');
        } finally {
            setLoading((prev: LoadingStates) => ({ ...prev, synthesizing: false }));
        }

    }, [subtaskResults, taskPlan, userQuery]);


    useEffect(() => {
        const allCompleted = taskPlan && Object.values(subtaskResults).every(r => r.status === SubtaskStatus.COMPLETED || r.status === SubtaskStatus.FAILED);
        if (allCompleted && loading.synthesizing) {
            synthesizeFinalResponse();
        }
    }, [subtaskResults, loading.synthesizing, synthesizeFinalResponse, taskPlan]);


    return (
        <div className="min-h-screen bg-gray-900">
            <Header />
            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="space-y-8">
                    <QueryInput onSubmit={handleExecuteWorkflow} isLoading={isWorkflowRunning} />

                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    
                    <OrchestratorView 
                        taskPlan={taskPlan} 
                        subtaskResults={subtaskResults} 
                        isLoading={loading.planning} 
                        isExecuting={loading.executing}
                    />

                    <SynthesizerView 
                        finalResponse={finalResponse}
                        isLoading={loading.synthesizing}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;
