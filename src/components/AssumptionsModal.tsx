import { useState } from 'react';

interface AssumptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assumptions: string[];
  onSave: (updated: string[]) => void;
}

export function AssumptionsModal({
  isOpen,
  onClose,
  assumptions,
  onSave,
}: AssumptionsModalProps) {
  const [items, setItems] = useState<string[]>(assumptions);
  const [newText, setNewText] = useState<string>('');

  if (!isOpen) return null;

  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    if (newText.trim()) {
      setItems([...items, newText.trim()]);
      setNewText('');
    }
  };

  const handleSave = () => {
    onSave(items);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#1a1a1e] border border-[#a78bfa]/30 w-full max-w-md rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between pb-3 border-b border-[#27272a]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d0bcff] text-[20px]">psychology</span>
            <h3 className="text-sm font-bold text-[#fafafa] font-headline-sm">Edit Smart Assumptions</h3>
          </div>
          <button onClick={onClose} className="text-[#908fa0] hover:text-white">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="py-4 space-y-3 overflow-y-auto flex-1 no-scrollbar">
          <p className="text-xs text-[#a1a1aa]">
            These architectural assumptions guide prompt expansion and prevent hallucinations:
          </p>

          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#0c0c0e] border border-[#27272a]/30 text-xs text-[#fafafa]"
              >
                <div className="flex items-center gap-2 flex-1 mr-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] shrink-0"></span>
                  <span>{item}</span>
                </div>
                <button
                  onClick={() => handleRemove(idx)}
                  className="text-[#ffb4ab] hover:text-red-400 p-1"
                  title="Remove assumption"
                >
                  <span className="material-symbols-outlined text-[15px]">delete</span>
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 flex gap-2">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Add custom assumption..."
              className="flex-1 rounded-xl bg-[#0c0c0e] border border-[#27272a]/40 text-xs px-3 py-2 text-[#fafafa] focus:outline-none focus:border-[#8b5cf6]"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button
              onClick={handleAdd}
              className="px-3 py-2 bg-[#8b5cf6]/30 text-[#c4b5fd] border border-[#8b5cf6]/30 rounded-xl text-xs font-semibold hover:bg-[#8b5cf6]/40"
            >
              Add
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-[#27272a]/30 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#0c0c0e] text-xs text-[#a1a1aa] hover:text-[#fafafa]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-[#7c3aed] text-xs font-bold text-white shadow-md active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
