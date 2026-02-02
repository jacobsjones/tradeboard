import { useState, useEffect } from 'react';
import { X, Trash2, Save, Hash, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { type Ticket, type TicketPriority, type TicketStatus } from '../types/ticket';

interface TicketModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticket: Partial<Ticket>) => void;
  onDelete?: () => void;
}

const priorityOptions: { value: TicketPriority; label: string; color: string }[] = [
  { value: 'high', label: 'High Priority', color: 'text-priority-high bg-priority-high/10 border-priority-high/20' },
  { value: 'medium', label: 'Medium Priority', color: 'text-priority-medium bg-priority-medium/10 border-priority-medium/20' },
  { value: 'low', label: 'Low Priority', color: 'text-priority-low bg-priority-low/10 border-priority-low/20' },
];

const statusOptions: { value: TicketStatus; label: string; color: string }[] = [
  { value: 'todo', label: 'To Do', color: 'text-column-todo' },
  { value: 'inprogress', label: 'In Progress', color: 'text-column-inprogress' },
  { value: 'hold', label: 'On Hold', color: 'text-column-hold' },
  { value: 'done', label: 'Done', color: 'text-column-done' },
];

const tagColors = [
  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'bg-amber-500/10 text-amber-400 border-amber-500/20',
];

function getTagColor(index: number): string {
  return tagColors[index % tagColors.length];
}

export function TicketModal({ ticket, isOpen, onClose, onSave, onDelete }: TicketModalProps) {
  const [formData, setFormData] = useState<Partial<Ticket>>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    tags: [],
    assignee: 'Jacob',
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        tags: ticket.tags,
        assignee: ticket.assignee,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        tags: [],
        assignee: 'Jacob',
      });
    }
  }, [ticket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  if (!isOpen) return null;

  const selectedPriority = priorityOptions.find(p => p.value === formData.priority);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedPriority?.color}`}>
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {ticket ? 'Edit Trade' : 'New Trade'}
              </h2>
              <p className="text-xs text-trade-400">
                {ticket ? 'Update trade details' : 'Create a new trade ticket'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-trade-400 hover:text-white hover:bg-trade-600/50 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="modal-body space-y-5">
            {/* Title */}
            <div>
              <label className="form-label">Trade Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input"
                placeholder="e.g., AAPL Call Options"
              />
            </div>

            {/* Description */}
            <div>
              <label className="form-label">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-input resize-none"
                placeholder="Add trade notes, strategy, or observations..."
              />
            </div>

            {/* Status & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Status</label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TicketStatus })}
                    className="form-input appearance-none cursor-pointer"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-trade-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="form-label">Priority</label>
                <div className="relative">
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                    className="form-input appearance-none cursor-pointer"
                  >
                    {priorityOptions.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                  <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-trade-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label className="form-label">Assignee</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-trade-400" />
                <input
                  type="text"
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  className="form-input pl-10"
                  placeholder="Assignee name"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="form-label">Tags</label>
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-trade-400" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="form-input pl-10"
                    placeholder="Add tag and press Enter"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn-secondary px-4"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag, index) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${getTagColor(index)}`}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:opacity-70 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {formData.tags?.length === 0 && (
                  <p className="text-xs text-trade-500 italic">No tags added</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-footer">
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-priority-high bg-priority-high/10 border border-priority-high/20 hover:bg-priority-high/20 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Delete</span>
              </button>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                <Save className="w-4 h-4" />
                Save Trade
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
