/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
// import {plus} from "../plus.svg";
import "./App.css";

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function App() {
  const [stage1, setStage1] = useState([]);
  const [stage2, setStage2] = useState([]);
  const [stage3, setStage3] = useState([]);

  const board = [
    { label:"mohit",id: "stage1", stage: stage1, setStage: setStage1 },
    { label:"mohit",id: "stage2", stage: stage2, setStage: setStage2 },
    { label:"mohit",id: "stage3", stage: stage3, setStage: setStage3 },
  ];

  const moveTask = (item, fromStageId, toStageId) => {
    const fromStage = board.find((s) => s.id === fromStageId);
    const toStage = board.find((s) => s.id === toStageId);

    if (fromStage && toStage) {
      fromStage.setStage((prev) => prev.filter((task) => task.id !== item.id));

      const updatedItem = {
        ...item,
        parentId: toStageId,
        history: [...item.history, fromStageId], // Update the history correctly
      };

      toStage.setStage((prev) => [...prev, updatedItem]);
    }
  };

  // Board
  return (
    <div className="Board flex gap-4 flex-1 w-full h-full min-h-full self-stretch overflow-auto">
      {board.map(({label, id, stage, setStage  }, index) => (
        <Stage
        label={label}
          id={id}
          key={"stage" + index}
          addTask={(input) => {
            if (!input) return;
            let value = {
              value: input,
              id: generateId(),
              parentId: id,
              history: [],
            };

            setStage([...stage, value]);
          }}
          moveTask={moveTask}
        >
          {stage.map(({ id, value, parentId, history }, index) => (
            <Item
              id={id}
              value={value}
              parentId={parentId}
              history={history}
              key={"1" + index}
            />
          ))}
        </Stage>
      ))}
    </div>
  );
}
export default App;

const Stage = ({label, id, addTask, children, moveTask }) => {
  function handleDragEnd(event) {
    const getValue = JSON.parse(event.dataTransfer.getData("pass"));
    const { parentId } = getValue;
    if (parentId === id) {
      return;
    }
    moveTask(getValue, parentId, id);
  }

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      className="Stage border rounded p-4 flex flex-col text-lg font-semibold w-full gap-4 flex-1 "
    >
      <div className="flex text-lg justify-between">
        {label}
        <span>+</span>
        </div>
      <FormInput id={"form" + id} handleSubmit={addTask} />
      {children}
    </div>
  );
};

const Item = ({ id, value, parentId, history }) => {
  // Remove history state management from Item, only display history
  function handleDragStart(event) {
    event.dataTransfer.setData(
      "pass",
      JSON.stringify({
        id,
        value,
        parentId,
        history, // Pass the current history
      })
    );
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="Item border rounded p-2"
    >
      {value}
      {/* <div className="text-sm text-gray-500">
        History: {history.join(" -> ")}
      </div> */} </div>
  );
};

const FormInput = ({ handleSubmit }) => {
  const [input, setInput] = useState("");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit(input.trim());
        setInput("");
      }}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="bg-black text-white"
      />
    </form>
  );
};
