import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Edit2,
  Trash2
} from 'lucide-react';
import { Chip } from '@heroui/react';
import { Task } from '@shared/stores/taskStore'; 

interface TaskProps {
  task: Task;
  onComplete: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const FocusTaskCard: React.FC<TaskProps> = ({ 
  task, 
  onComplete, 
  onEdit, 
  onDelete, 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isCompleted = task.status === 'COMPLETED';

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div 
        className={`w-full bg-workspace-card/90 backdrop-blur-xl border ${
          isHovered ? 'border-workspace-primary/40 shadow-sm' : 'border-workspace-border/60'
        } transition-all duration-200 rounded-xl overflow-hidden group cursor-pointer hover:bg-workspace-card`}
        onClick={() => onEdit(task.id)}
      >
        <div className="p-4 flex flex-row items-center gap-4">
          
          {/* Checkbox */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onComplete(task.id);
            }}
            className="flex-shrink-0 focus:outline-none"
          >
            {isCompleted ? (
              <CheckCircle2 size={24} className="text-workspace-green drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            ) : (
              <Circle size={24} className="text-workspace-text-secondary hover:text-workspace-primary transition-colors" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className={`text-base font-medium truncate transition-colors ${
                isCompleted ? 'text-workspace-text-secondary line-through' : 'text-workspace-text'
              }`}>
                {task.title}
              </h3>
              {task.priority === 'HIGH' && (
                <Chip size="sm" variant="soft" className="text-[10px] h-5 bg-workspace-red/10 text-workspace-red">High</Chip>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-xs text-workspace-text-secondary">
              {task.dueDate && (
                <div className="flex items-center gap-1 text-workspace-primary">
                  <Clock size={12} />
                  <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              )}
            </div>
          </div>

          {/* Hover Actions */}
          <div className={`flex items-center gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              className="p-2 text-workspace-text-secondary hover:text-workspace-primary hover:bg-workspace-primary/10 rounded-lg transition-colors focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task.id);
              }}
            >
              <Edit2 size={16} />
            </button>
            
            <button 
              className="p-2 text-workspace-text-secondary hover:text-workspace-red hover:bg-workspace-red/10 rounded-lg transition-colors focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
