import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";

// 💡 Optional drag handle icon
const DragHandle = ({ listeners, attributes }) => (
  <span
    {...listeners}
    {...attributes}
    className="cursor-grab px-2 text-gray-400 hover:text-accent"
    title="Drag to reorder"
  >
    ⠿
  </span>
);

export default function SortableTask({ task, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto", // 💥 prevents overlap glitches
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex justify-between items-start bg-white/10 backdrop-blur-md border border-text/20 rounded-lg p-1 shadow-sm hover:shadow-xl transition-shadow w-full mb-3 select-none"
    >
      {/* 👇 Inject drag handle */}
      <div className="pr-2 pt-1">
        <DragHandle listeners={listeners} attributes={attributes} />
      </div>

      {/* 👇 Main task content (clickable/editable) */}
      <div className="flex-1">{children}</div>
    </motion.li>
  );
}