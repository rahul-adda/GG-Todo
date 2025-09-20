"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { FaRegFlag } from "react-icons/fa6";
import { TbPencilMinus } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface Todo {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: number; // 1 = Upcoming, 3 = Completed
}

interface TodoDetailCardProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onUpdate: (updatedTodo: Todo) => void;
}

export default function TodoDetailCard({
  todo,
  onDelete,
  onUpdate,
}: TodoDetailCardProps) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...todo });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData({ ...todo });
    setEditMode(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          px: 4,
          py: 3,
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: 3,
        }}
      >
        {/* Title */}
        {editMode ? (
          <TextField
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="Enter Title"
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": { borderColor: "#ddd" },
                "&:hover fieldset": { borderColor: "#0CAF60" },
                "&.Mui-focused fieldset": {
                  borderColor: "#0CAF60",
                  borderWidth: 2,
                },
                fontSize: 18,
                fontWeight: 600,
              },
            }}
          />
        ) : (
          <Typography
            variant="h5"
            fontWeight={600}
            gutterBottom
            sx={{
              fontSize: "26px",
              lineHeight: "32px",
              letterSpacing: "0.5%",
              color: "#21252B",
              mb: 2,
            }}
          >
            {formData.title}
          </Typography>
        )}

        {/* Details Row */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          {/* Due Date */}
          <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <HiOutlineCalendarDateRange size={18} color={ "#657081"} />
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ fontSize: 14, color: "#21252B" }}
            >
              Due Date:
            </Typography>
            {editMode ? (
              <DateTimePicker
                value={formData.dueDate ? new Date(formData.dueDate) : null}
                onChange={(newValue) =>
                  handleChange(
                    "dueDate",
                    newValue ? newValue.toISOString() : ""
                  )
                }
                slotProps={{
                  textField: {
                    size: "small",
                    variant: "outlined",
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "& fieldset": { borderColor: "#ddd" },
                        "&:hover fieldset": { borderColor: "#0CAF60" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#0CAF60",
                          borderWidth: 2,
                        },
                        height: "36px",
                        fontSize: 14,
                      },
                      "& input": { paddingLeft: 1 },
                    },
                  },
                  popper: {
                    sx: { zIndex: 2000, borderRadius: 2, boxShadow: 3 },
                  },
                }}
              />
            ) : (
              <Typography
                variant="body2"
                sx={{ fontSize: 14, color: "#21252B", ml: 1 }}
              >
                {new Date(formData.dueDate).toLocaleString()}
              </Typography>
            )}
          </Grid>

          {/* Status */}
          <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FaRegFlag size={18} color={ "#657081"} />
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ fontSize: 14, color: "#21252B" }}
            >
              Status:
            </Typography>
            {editMode ? (
              <Select
                value={
                  formData.status === undefined || formData.status === null
                    ? ""
                    : String(formData.status)
                }
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("status", Number(value));
                }}
                displayEmpty
                inputProps={{ "aria-label": "Role" }}
                MenuProps={{
                  disablePortal: true,
                  PaperProps: { style: { maxHeight: 200 } },
                }}
              >
                {" "}
                <MenuItem value="" disabled>
                  {" "}
                  Select Status{" "}
                </MenuItem>{" "}
                <MenuItem value="1">Upcoming</MenuItem>{" "}
                <MenuItem value="3">Completed</MenuItem>{" "}
              </Select>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  ml: 1,
                  fontSize: 14,
                  fontWeight: 500,
                  color: formData.status === 1 ? "#FFA500" : "#4CAF50",
                }}
              >
                {formData.status === 1 ? "Upcoming" : "Completed"}
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Action Buttons */}
        {!editMode ? (
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <IconButton
              size="small"
              onClick={() => setEditMode(true)}
              // sx={{ bgcolor: "#F1F3F5" }}
            >
            <TbPencilMinus size={20} color={ "#657081"} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(todo._id)}
              // sx={{ bgcolor: "#F1F3F5" }}
            >
            <RiDeleteBinLine size={20} color={ "#657081"} />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Button variant="contained" size="small" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" size="small" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Description */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontSize: 18, fontWeight: 600, color: "#21252B" }}
        >
          Description
        </Typography>
        {editMode ? (
          <TextField
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            fullWidth
            multiline
            minRows={4}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": { borderColor: "#ddd" },
                "&:hover fieldset": { borderColor: "#0CAF60" },
                "&.Mui-focused fieldset": {
                  borderColor: "#0CAF60",
                  borderWidth: 2,
                },
                fontSize: 14,
              },
            }}
          />
        ) : (
          <Typography variant="body2" sx={{ fontSize: 14, color: "#21252B" }}>
            {formData.description}
          </Typography>
        )}
      </Box>
    </LocalizationProvider>
  );
}
