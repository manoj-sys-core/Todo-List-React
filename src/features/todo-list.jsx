import { useState} from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import SplitText from "../components/splittext";
import DarkVeil from "../components/background";

export default function Todo() {
  const [inp, setInp] = useState("");
  const [todo, setTodo] = useState([]);
  const [comp, setComp] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const addTask = () => {
    if (inp.trim() !== "") {
      if (editIndex !== null) {
        const updated = [...todo];
        updated[editIndex] = inp;
        setTodo(updated);
        setEditIndex(null);
      } else {
        setTodo([...todo, inp]);
      }
      setInp("");
    }
  };

  const removeTask = (index) => {
    setTodo(todo.filter((_, i) => i !== index));
    setComp(comp.filter((i) => i !== index));
  };

  const complete = (index) => {
    if (comp.includes(index)) {
      setComp(comp.filter((i) => i !== index));
    } else {
      setComp([...comp, index]);
    }
  };

  const editTask = (index) => {
    setInp(todo[index]);
    setEditIndex(index);
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <DarkVeil />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          width: "100%",
          maxWidth: 400,
          padding: 20,
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: 10,
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexDirection: "column",
          fontSize: "14px",
        }}
      >
          <SplitText
            text="Todo List!"
            className="text-4xl font-semibold text-center"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />

        <div style={{ display: "flex", marginBottom: 20, gap: "20px", width: "100%" }}>
          <TextField
            fullWidth
            label="Task"
            variant="standard"
            placeholder="Enter the task"
            value={inp}
            type="text"
            onChange={(e) => setInp(e.target.value)}
          />
          <Button variant="contained" size="small" onClick={addTask} >
            {editIndex !== null ? "Update" : "Add"}
          </Button>
        </div>

        <List style={{ width: "100%" }}>
          {todo.map((item, index) => (
            <ListItem key={index} divider>
              <Checkbox
                checked={comp.includes(index)}
                onChange={() => complete(index)}
              />
              <ListItemText
                primary={item}
                style={{
                  textDecoration: comp.includes(index) ? "line-through" : "none",
                  marginRight: 100,
                }}
              />
              <ListItemSecondaryAction>
                <ButtonGroup
      disableElevation
      variant="outlined"
      aria-label="Disabled button group"
                >
                  <Button onClick={() => editTask(index)}>Edit</Button>
                  <Button color="error" onClick={() => removeTask(index)}>Remove</Button>
                </ButtonGroup>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
}
