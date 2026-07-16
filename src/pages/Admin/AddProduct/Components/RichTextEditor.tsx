import React, { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
  Trash2,
  Code,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Undo2,
  Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  label,
  required,
  error,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value);

  // Sync internal HTML value with external value
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
    setHtmlValue(value || "");
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // If editor is empty or just has a break tag, clear it out completely to trigger validation
      const cleanHtml = html === "<br>" || html === "" ? "" : html;
      onChange(cleanHtml);
    }
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlValue(e.target.value);
    onChange(e.target.value);
  };

  const executeCommand = (command: string, value: string = "") => {
    if (isHtmlMode) return;
    document.execCommand(command, false, value);
    handleInput();
    // Keep focus
    editorRef.current?.focus();
  };

  const addLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const colors = [
    { name: "Default", color: "#1e293b" },
    { name: "Red", color: "#ef4444" },
    { name: "Blue", color: "#3b82f6" },
    { name: "Green", color: "#22c55e" },
    { name: "Amber", color: "#f59e0b" },
    { name: "Purple", color: "#a855f7" },
  ];

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-350">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className={cn(
        "border rounded-xl bg-white dark:bg-slate-900/60 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500",
        error ? "border-red-500 focus-within:ring-red-500/20" : "border-slate-200 dark:border-slate-800"
      )}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-55/80 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 select-none">
          {/* Text Style */}
          <button
            type="button"
            title="Bold"
            onClick={() => executeCommand("bold")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Italic"
            onClick={() => executeCommand("italic")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Underline"
            onClick={() => executeCommand("underline")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Strikethrough"
            onClick={() => executeCommand("strikeThrough")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* Heading Selection */}
          <button
            type="button"
            title="Paragraph"
            onClick={() => executeCommand("formatBlock", "p")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Heading 1"
            onClick={() => executeCommand("formatBlock", "h1")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Heading 2"
            onClick={() => executeCommand("formatBlock", "h2")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Heading 3"
            onClick={() => executeCommand("formatBlock", "h3")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* Lists */}
          <button
            type="button"
            title="Unordered List"
            onClick={() => executeCommand("insertUnorderedList")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Ordered List"
            onClick={() => executeCommand("insertOrderedList")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* Alignment */}
          <button
            type="button"
            title="Align Left"
            onClick={() => executeCommand("justifyLeft")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Align Center"
            onClick={() => executeCommand("justifyCenter")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Align Right"
            onClick={() => executeCommand("justifyRight")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Align Justify"
            onClick={() => executeCommand("justifyFull")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* Actions */}
          <button
            type="button"
            title="Insert Link"
            onClick={addLink}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Clear Formatting"
            onClick={() => executeCommand("removeFormat")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>

          {/* Undo/Redo */}
          <button
            type="button"
            title="Undo"
            onClick={() => executeCommand("undo")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Redo"
            onClick={() => executeCommand("redo")}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          {/* Color Picker Dropdown */}
          <div className="relative group">
            <button
              type="button"
              title="Text Color"
              className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="w-3 h-3 rounded-full border border-slate-300 bg-slate-900 group-hover:bg-blue-600" />
            </button>
            <div className="absolute left-0 mt-1 hidden group-hover:flex flex-col gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50">
              {colors.map((c) => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => executeCommand("foreColor", c.color)}
                  className="flex items-center gap-2 px-2.5 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-750 dark:text-slate-300 w-28 text-left cursor-pointer"
                >
                  <span className="size-3 rounded-full border" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1" />

          {/* HTML Source Code Toggle */}
          <button
            type="button"
            title="Toggle Source Code"
            onClick={() => setIsHtmlMode(!isHtmlMode)}
            className={cn(
              "p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer",
              isHtmlMode 
                ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" 
                : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
            )}
          >
            <Code className="w-4 h-4" />
            <span>HTML</span>
          </button>
        </div>

        {/* Editor Area */}
        {isHtmlMode ? (
          <textarea
            value={htmlValue}
            onChange={handleHtmlChange}
            placeholder="Write raw HTML code here..."
            className="w-full min-h-[220px] p-4 text-xs font-mono bg-slate-950 text-slate-300 border-0 focus:ring-0 focus:outline-none resize-y"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            {...({ placeholder } as any)}
            className="w-full min-h-[220px] p-4 text-sm text-slate-850 dark:text-slate-150 focus:outline-none overflow-y-auto prose prose-sm max-w-none dark:prose-invert [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-medium"
            style={{ minHeight: "220px" }}
          />
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
