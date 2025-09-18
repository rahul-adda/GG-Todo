"use client"
import MySwitch from "@/ui-component/MySwitch";
import CommonTable, { TableCellDef } from "@/ui-component/Table/CommonTable";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
type Row = { name: string; email: string; role: number; todosCount: number; createdAt: string; enableSearch?: boolean; removeSearch?: boolean; status:boolean };
import { AiOutlinePlus } from "react-icons/ai";
import { TbFilter } from "react-icons/tb";


const users = [
  {
    name: "Rahul Sharma",
    status: true,
    email: "rahul.sharma@example.com",
    role: 1,
    createdAt: "2023-08-01T10:30:00Z",
    updatedAt: "2023-08-10T12:45:00Z",
    todosCount: 5,
  },
  {
    name: "Priya Verma",
    status: true,
    email: "priya.verma@example.com",
    role: 2,
    createdAt: "2023-08-02T09:20:00Z",
    updatedAt: "2023-08-11T14:10:00Z",
    todosCount: 8,
  },
  {
    name: "Aman Gupta",
    status: false,
    email: "aman.gupta@example.com",
    role: 1,
    createdAt: "2023-08-03T08:15:00Z",
    updatedAt: "2023-08-12T16:25:00Z",
    todosCount: 3,
  },
  {
    name: "Sneha Singh",
    status: true,
    email: "sneha.singh@example.com",
    role: 2,
    createdAt: "2023-08-04T11:50:00Z",
    updatedAt: "2023-08-13T18:40:00Z",
    todosCount: 6,
  },
  {
    name: "Arjun Mehta",
    status: false,
    email: "arjun.mehta@example.com",
    role: 1,
    createdAt: "2023-08-05T14:05:00Z",
    updatedAt: "2023-08-14T20:55:00Z",
    todosCount: 2,
  },
  {
    name: "Kavya Nair",
    status: true,
    email: "kavya.nair@example.com",
    role: 2,
    createdAt: "2023-08-06T15:25:00Z",
    updatedAt: "2023-08-15T09:05:00Z",
    todosCount: 7,
  },
  // {
  //   name: "Rohit Yadav",
  // status: true,
  //   email: "rohit.yadav@example.com",
  //   role: 1,
  //   createdAt: "2023-08-07T17:40:00Z",
  //   updatedAt: "2023-08-16T11:20:00Z",
  //   todosCount: 4,
  // },
  // {
  //   name: "Anjali Das",
  // status: true,
  //   email: "anjali.das@example.com",
  //   role: 2,
  //   createdAt: "2023-08-08T19:55:00Z",
  //   updatedAt: "2023-08-17T13:35:00Z",
  //   todosCount: 9,
  // },
  // {
  //   name: "Vikram Malhotra",
  // status: true,
  //   email: "vikram.malhotra@example.com",
  //   role: 1,
  //   createdAt: "2023-08-09T21:10:00Z",
  //   updatedAt: "2023-08-18T15:50:00Z",
  //   todosCount: 1,
  // },
  // {
  //   name: "Neha Reddy",
  // status: true,
  //   email: "neha.reddy@example.com",
  //   role: 2,
  //   createdAt: "2023-08-10T23:25:00Z",
  //   updatedAt: "2023-08-19T17:05:00Z",
  //   todosCount: 10,
  // },
];


export default function DashboardPage() {
  const columns: TableCellDef<Row>[] = [
    {
      headName: "Name",
      key: "name",
      enableCopying: true,
      enableSearch: true as any,
      customBody: (row: Row) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "150%",
              letterSpacing: "0.5%",
              color: "rgba(33, 37, 43, 1)"
            }}
          >
            {row.name}
          </span>

          <span
            style={{
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "150%",
              letterSpacing: "0.5%",
              color: "rgba(152, 159, 171, 1)"
            }}
          >
            {row.email}
          </span>
        </div>
      )
    },
    { headName: "Role", key: "role", customData:(data)=> data.role === 1 ? "Super Admin" : "Viewer" },
    {
      headName: "Actions",
      type: "action",
      customBody: (rowData) => {
        const [checked, setChecked] = useState(rowData.status || false);
  
        const handleChange = (event: any) => {
          setChecked(event.target.checked);
          console.log("Switch toggled for row:", rowData.name, event.target.checked);
        };
        return <MySwitch checked={checked} onChange={handleChange} />;
      },
    },  ];

  const TableName = () => {
    return (
      <Box>
        <Typography
          variant="body1"
          fontWeight={500}
          fontSize="16px"
          lineHeight="150%"
          letterSpacing="0.5%"
          color="rgba(33, 37, 43, 1)"
        >
          All Users
        </Typography>

        <Typography
          variant="body2"
          fontWeight={400}
          fontSize="12px"
          lineHeight="150%"
          letterSpacing="0.5%"
          color="rgba(152, 159, 171, 1)"
        >
          Last Updated : 16/08/2023 18:00
        </Typography>
      </Box>
    );
  };

  const ActionButtons = () => {
    return (
      <Box display="flex" gap="10px">
        <Button
          variant="contained"
          startIcon={<TbFilter size={18} color="rgba(11,159,87,1)" />}
          sx={{
            width: "103px",
            height: "36px",
            borderRadius: "4px",
            bgcolor: "rgba(248,249,250,1)",
            color: "rgba(106,115,131,1)",
            fontSize: "14px",
            fontWeight: 500,
            textTransform: "none",
            "&:hover": {
              bgcolor: "rgba(240,241,242,1)",
            },
            boxShadow: 'none'
          }}
        >
          Filter
        </Button>

        <Button
          variant="contained"
          startIcon={<AiOutlinePlus size={18} color="white" />}
          sx={{
            height: "36px",
            borderRadius: "4px",
            bgcolor: "rgba(12,175,96,1)",
            color: "white",
            fontSize: "14px",
            fontWeight: 500,
            textTransform: "none",
            "&:hover": {
              bgcolor: "rgba(10,155,85,1)",
            },
            boxShadow: 'none'
          }}
        >
          Add Users
        </Button>
      </Box>
    );
  };
  return (
    <div>
      <CommonTable<Row>
        tableStructure={columns}
        data={users}
        loading={false}
        buttonsAtSeachLevel={ActionButtons()}
        tableName={TableName()}
        // defaultSize={10}
        // defaultPage={1}
        removeSerialNo={true}
        handleBackend={true}
        enableSort
        removeSearch={true}
        defalutSortKey="createdAt"
      />
    </div>
  );
}
