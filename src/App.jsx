/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import "./App.css";

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function App() {
  const [stage1, setStage1] = useState([]);
  const [stage2, setStage2] = useState([]);
  const [stage3, setStage3] = useState([]);
  const [stage4, setStage4] = useState([]);
  const [activeStageId, setActiveStageId] = useState(null);

  const board = [
    { label: "Backlog", id: "stage1", stage: stage1, setStage: setStage1 },
    { label: "In Progess", id: "stage2", stage: stage2, setStage: setStage2 },
    { label: "Review", id: "stage3", stage: stage3, setStage: setStage3 },
    { label: "Complete", id: "stage4", stage: stage4, setStage: setStage4 },
  ];

  const deleteTask = (taskId, stageId) => {
    const stage = board.find((s) => s.id === stageId);
    if (stage) {
      stage.setStage((prev) => prev.filter((task) => task.id !== taskId));
    }
  };

  const moveTask = (item, fromStageId, toStageId) => {
    const fromStage = board.find((s) => s.id === fromStageId);
    const toStage = board.find((s) => s.id === toStageId);

    if (fromStage && toStage) {
      fromStage.setStage((prev) => prev.filter((task) => task.id !== item.id));

      const updatedItem = {
        ...item,
        parentId: toStageId,
        history: [...item.history, fromStageId],
      };

      toStage.setStage((prev) => [...prev, updatedItem]);
    }
  };

  const closeForm = () => {
    setActiveStageId(null);
  };

  return (
    <div
      className={`Board ${
        activeStageId ? "dimmed" : ""
      } flex gap-10 flex-1 w-full h-full min-h-full self-stretch`}
    >
      {board.map(({ label, id, stage, setStage }, index) => (
        <Stage
          label={label}
          id={id}
          key={"stage" + index}
          addTask={(input) => {
            if (!input) return;
            const value = {
              ...input,
              id: generateId(),
              parentId: id,
              history: [],
            };
            setStage([...stage, value]);
          }}
          moveTask={moveTask}
          showForm={() => setActiveStageId(id)}
          isActive={activeStageId === id}
        >
          {stage.map(
            (
              { id, name, Experience, description, Skills, parentId, history },
              index
            ) => (
              <Item
                deleteTask={deleteTask}
                key={"1" + index}
                id={id}
                name={name}
                Experience={Experience}
                description={description}
                Skills={Skills}
                parentId={parentId}
                history={history}
              />
            )
          )}
        </Stage>
      ))}
      {activeStageId && (
        <div className="card-main">
          <TaskForm
            onClose={closeForm}
            onSubmit={(input) => {
              const stage = board.find((s) => s.id === activeStageId);
              if (stage) {
                stage.setStage((prev) => [
                  ...prev,
                  {
                    ...input,
                    id: generateId(),
                    parentId: activeStageId,
                    history: [],
                  },
                ]);
              }
              closeForm();
            }}
          />
        </div>
      )}
    </div>
  );
}
export default App;

const Stage = ({
  label,
  id,
  addTask,
  children,
  moveTask,
  showForm,
  isActive,
}) => {
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
      className={`Stage rounded p-4 flex flex-col text-lg font-semibold w-full h-fit min-h-[90dvh] gap-4 flex-1 border bg-[#d5d7e9] overflow-auto ${
        isActive ? "active-stage" : ""
      }`}
    >
      <div className="flex text-2xl justify-between gap-2 border-2 rounded-xl p-2 bg-white items-center">
        {label}
        <span onClick={showForm} className="cursor-pointer bg-inherit">
          +
        </span>
      </div>
      {children}
    </div>
  );
};

const TaskForm = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [Experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [Skills, setSkills] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const newTask = {
      name,
      Experience,
      description,
      Skills,
    };
    onSubmit(newTask);
  };

  return (
    <div className="card bg-[rgb(207, 207, 227)] p-5 rounded-lg shadow-[0px_0px_10px_rgba(0,0,0,0.2) z-20 ">
      <form onSubmit={handleSubmit} className="task-form flex flex-col gap-4.5">
        <h1 className="text-xl font-bold">New Member</h1>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Experience:</label>
        <input
          type="number"
          value={Experience}
          onChange={(e) => setExperience(e.target.value)}
          required
        />

        <label>Description:</label>
        <input
          type="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Skills:</label>
        <input
          type="text"
          value={Skills}
          onChange={(e) => setSkills(e.target.value)}
          required
        />
        <div className="flex justify-between ">
          <button type="submit">Add Task</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const Item = ({
  id,
  name,
  Experience,
  description,
  Skills,
  parentId,
  history,
  deleteTask,
}) => {
  function handleDragStart(event) {
    event.dataTransfer.setData(
      "pass",
      JSON.stringify({
        id,
        name,
        Experience,
        description,
        Skills,
        parentId,
        history,
      })
    );
  }
  const style = `bg-inherit`;
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="Item rounded p-2 bg-white flex flex-col shadow-[0px_5px_10px_rgba(0,0,0,0.3)]"
    >
      {/* <span className="flex justify-between bg-inherit pb-2"> */}
      <h3 className="bg-inherit text-xl text-left text-nowrap">{name}</h3>
      <p className="bg-inherit text-sm pb-2 text-right"> {Experience} Years</p>

      <p className="bg-inherit text-justify text-xs pb-3">{description}</p>
      <span className="flex justify-between bg-inherit">
        <p className="bg-inherit items-end text-left text-lg">{Skills}</p>
        <button
          onClick={() => deleteTask(id, parentId)}
          className="bg-[#8b8bda] text-white rounded h-6 w-6 "
        >
          D
        </button>
      </span>
    </div>
  );
};
