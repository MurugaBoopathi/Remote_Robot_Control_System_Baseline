import React from "react";

export function Tabs({ value, onValueChange, children, className }) {
  const tabList = React.Children.toArray(children).find(
    child => child.type && child.type.displayName === "TabsList"
  );
  const tabContents = React.Children.toArray(children).filter(
    child => child.type && child.type.displayName === "TabsContent"
  );
  return (
    <div className={className || ""}>
      {tabList && React.cloneElement(tabList, { value, onValueChange })}
      {tabContents.map(content =>
        content.props.value === value ? content : null
      )}
    </div>
  );
}

export function TabsList({ children, value, onValueChange, className }) {
  return (
    <div className={className || "flex gap-2"}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { value, onValueChange })
      )}
    </div>
  );
}
TabsList.displayName = "TabsList";

export function TabsTrigger({ children, value, onValueChange, className, ...props }) {
  return (
    <button
      className={
        (className || "px-4 py-2 rounded bg-slate-200 text-slate-700 font-medium mr-2") +
        (props.value === value ? " bg-indigo-600 text-white" : "")
      }
      onClick={() => onValueChange(props.value)}
      type="button"
    >
      {children}
    </button>
  );
}
TabsTrigger.displayName = "TabsTrigger";

export function TabsContent({ children, value, className }) {
  return (
    <div className={className || "mt-4"}>
      {children}
    </div>
  );
}
TabsContent.displayName = "TabsContent";
