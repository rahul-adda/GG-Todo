"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { useCustomMutation } from "@/lib/QueryHooks";
import { cleanPayload } from "@/utils/commonTable";
import { TbPlus } from "react-icons/tb";
import { MdDateRange } from "react-icons/md";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

interface CreateTodoCardProps {
  setOpen: (open: boolean) => void;
}

export default function CreateTodoCard({ setOpen }: CreateTodoCardProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const { mutation, queryClient } = useCustomMutation({
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["todo_list"] });
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateTodo = () => {
    const data = cleanPayload(formData); // Remove empty fields
    mutation.mutate({
      method: "POST",
      wantToast: true,
      url: `todo`,
      data,
    });
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="body2">Title</Typography>
          <TextField
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="Enter Title"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": { borderColor: "#ddd" },
                "&:hover fieldset": { borderColor: "#0CAF60" },
                "&.Mui-focused fieldset": {
                  borderColor: "#0CAF60",
                  borderWidth: "2px",
                },
              },
            }}
          />
        </Box>

        {/* Description */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="body2">Description</Typography>
          <TextField
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="Enter Description"
            multiline
            minRows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": { borderColor: "#ddd" },
                "&:hover fieldset": { borderColor: "#0CAF60" },
                "&.Mui-focused fieldset": {
                  borderColor: "#0CAF60",
                  borderWidth: "2px",
                },
              },
            }}
          />
        </Box>

        <DateTimePicker
          value={formData.dueDate ? new Date(formData.dueDate) : null}
          onChange={(newValue) =>
            handleChange("dueDate", newValue ? newValue.toISOString() : "")
          }
          enableAccessibleFieldDOMStructure={false} // Important
          slotProps={{
            field: { openPickerButtonPosition: "start" },
            textField: {
              fullWidth: true,
              variant: "outlined",
              size: "small",
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MdDateRange style={{ color: "#657081", fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: {
                  paddingLeft: "4px",
                },
              },
              sx: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  paddingY: "8px",
                  "& fieldset": { borderColor: "#ddd" },
                  "&:hover fieldset": { borderColor: "#0CAF60" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0CAF60",
                    borderWidth: 2,
                  },
                  backgroundColor: "#fff",
                  color: "#333",
                },
                "& input": { paddingLeft: "8px", color: "#333" },
              },
            },
            popper: {
              sx: {
                zIndex: 2000,
              },
            },
          }}
        />
      </Box>

      <Button
        startIcon={<TbPlus />}
        variant="contained"
        disabled={mutation.isPending}
        onClick={handleCreateTodo}
        sx={{
          mt: 2,
          height: "50px",
          borderRadius: "4px",
          px: "16px",
          backgroundColor: "#0CAF60",
          color: "#fff",
          fontWeight: 500,
          fontSize: "14px",
          textTransform: "none",
          boxShadow: "none",
          width: "auto",
          float: "inline-end",
          "&:hover": { backgroundColor: "#099950", boxShadow: "none" },
        }}
      >
        {mutation.isPending ? "Adding..." : "Add Todo"}
      </Button>
    </>
  );
}
