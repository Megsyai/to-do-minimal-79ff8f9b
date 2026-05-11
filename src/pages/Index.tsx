import React, { useState } from "react";
import { Plus, Trash2, CheckCircle2, Circle, ListTodo } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const Index = () => {
  const [todos, setTodos] = useStore<Todo[]>("minimal-todos", []);
  const [inputValue, setInputValue] = useState("");

  const addTodo = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue("");
    toast.success("تمت إضافة المهمة بنجاح");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.error("تم حذف المهمة");
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 font-sans selection:bg-zinc-200" dir="rtl">
      <div className="max-w-2xl mx-auto px-6 py-20">
        {/* Header */}
        <header className="mb-12 space-y-2 text-right">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="p-2 bg-zinc-900 dark:bg-zinc-100 rounded-xl">
              <ListTodo className="w-6 h-6 text-white dark:text-zinc-900" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">مهامي</h1>
          </motion.div>
          <p className="text-zinc-500 dark:text-zinc-400">
            {todos.length === 0 
              ? "ابدأ يومك بإضافة بعض المهام" 
              : `لديك ${todos.length} مهام، أنجزت منها ${completedCount}`}
          </p>
        </header>

        {/* Input Area */}
        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={addTodo} 
          className="relative mb-12"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ما الذي تود إنجازه اليوم؟"
            className="h-16 pr-6 pl-16 text-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm focus:ring-zinc-500 focus:border-zinc-500 transition-all"
          />
          <Button 
            type="submit"
            size="icon"
            className="absolute left-3 top-3 w-10 h-10 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-300 rounded-xl"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.form>

        {/* Todo List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {todos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={cn(
                  "group flex items-center justify-between p-4 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl transition-all hover:shadow-md",
                  todo.completed && "opacity-60 bg-zinc-50 dark:bg-zinc-900/50"
                )}>
                  <div className="flex items-center gap-4 flex-1">
                    <button 
                      onClick={() => toggleTodo(todo.id)}
                      className="transition-transform active:scale-90"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-50" />
                      ) : (
                        <Circle className="w-6 h-6 text-zinc-300 group-hover:text-zinc-400" />
                      )}
                    </button>
                    <span className={cn(
                      "text-lg text-zinc-700 dark:text-zinc-200 transition-all",
                      todo.completed && "line-through text-zinc-400 dark:text-zinc-500"
                    )}>
                      {todo.text}
                    </span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all rounded-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {todos.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-zinc-100 dark:bg-zinc-900 rounded-full">
                <ListTodo className="w-10 h-10 text-zinc-300" />
              </div>
              <p className="text-zinc-400">قائمة المهام فارغة حالياً</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
