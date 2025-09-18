"use client"
import CommonTable, { TableCellDef } from "@/ui-component/Table/CommonTable";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
type Row = { title: string; description: string; lastDate: string; status: number; createdAt: string; enableSearch?: boolean; removeSearch?: boolean };
import { AiOutlinePlus } from "react-icons/ai";
import { TbFilter } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";


const todos = [
  {
    "title": "Finish project report",
    "description": "Complete the final report for the Q3 project",
    "lastDate": "2025-09-20",
    "status": 1,
    "createdAt": "2025-09-15T10:00:00Z",
    "updatedAt": "2025-09-15T10:00:00Z"
  },
  {
    "title": "Team meeting",
    "description": "Discuss project milestones and deadlines",
    "lastDate": "2025-09-18",
    "status": 1,
    "createdAt": "2025-09-14T09:30:00Z",
    "updatedAt": "2025-09-17T08:00:00Z"
  },
  {
    "title": "Code review",
    "description": "Review pull requests for the new feature branch",
    "lastDate": "2025-09-19",
    "status": 2,
    "createdAt": "2025-09-15T12:00:00Z",
    "updatedAt": "2025-09-16T15:30:00Z"
  },
  {
    "title": "Update documentation",
    "description": "Add API endpoints and usage examples to docs",
    "lastDate": "2025-09-22",
    "status": 1,
    "createdAt": "2025-09-15T14:00:00Z",
    "updatedAt": "2025-09-15T14:00:00Z"
  },
  {
    "title": "Prepare presentation",
    "description": "Create slides for the quarterly team review",
    "lastDate": "2025-09-21",
    "status": 2,
    "createdAt": "2025-09-14T11:00:00Z",
    "updatedAt": "2025-09-16T09:00:00Z"
  },
  // {
  //   "title": "Fix login bug",
  //   "description": "Investigate and resolve the authentication issue",
  //   "lastDate": "2025-09-18",
  //   "status": "completed",
  //   "createdAt": "2025-09-13T16:00:00Z",
  //   "updatedAt": "2025-09-17T10:30:00Z"
  // },
  // {
  //   "title": "Optimize database",
  //   "description": "Run queries to improve performance of main collections",
  //   "lastDate": "2025-09-25",
  //   "status": "pending",
  //   "createdAt": "2025-09-15T08:30:00Z",
  //   "updatedAt": "2025-09-15T08:30:00Z"
  // },
  // {
  //   "title": "Plan team outing",
  //   "description": "Organize a team lunch and fun activities",
  //   "lastDate": "2025-09-30",
  //   "status": "pending",
  //   "createdAt": "2025-09-12T13:00:00Z",
  //   "updatedAt": "2025-09-12T13:00:00Z"
  // },
  // {
  //   "title": "Write blog post",
  //   "description": "Publish a blog about recent product updates",
  //   "lastDate": "2025-09-23",
  //   "status": "in-progress",
  //   "createdAt": "2025-09-14T15:00:00Z",
  //   "updatedAt": "2025-09-16T12:00:00Z"
  // },
  // {
  //   "title": "Conduct user testing",
  //   "description": "Get feedback on the new UI from selected users",
  //   "lastDate": "2025-09-24",
  //   "status": "pending",
  //   "createdAt": "2025-09-15T09:00:00Z",
  //   "updatedAt": "2025-09-15T09:00:00Z"
  // }
]

const statsData = [
  { label: "All Todos", value: 12 },
  { label: "Upcoming", value: 4 },
  { label: "Completed", value: 6 },
];

export default function DashboardPage() {
  const columns: TableCellDef<Row>[] = [
    {
      headName: "Todo",
      key: "title",
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
            {row.title}
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
            {row.description}
          </span>
        </div>
      )
    },
    { headName: "Due Date", key: "lastDate", enableSort: true },
    {
      headName: "Status", key: "status", enableSort: true, customData: (data) =>
        <Box
          sx={{
            backgroundColor:
              data?.status === 1
                ? "rgba(231, 247, 239, 1)"
                : data?.status === 2
                  ? "rgba(255, 235, 59, 0.2)"
                  : "rgba(255, 208, 35, 0.2)",
            color:
              data?.status === 1
                ? "rgba(12, 175, 96, 1)"
                : data?.status === 2
                  ? "rgba(228, 180, 1, 1)"
                  : "rgba(228, 180, 1, 1)",
            fontWeight: 400,
            fontSize: "10px",
            letterSpacing: '0.5%',
            px: '8px',
            py: '2px',
            borderRadius: "20px",
            display: "inline-block",
            textAlign: "center",
          }}
        >
          {data?.status === 1 ? 'Completed' : data?.status === 2 ? 'Upcoming' : 'In Progress'}
        </Box>
    },
    {
      headName: "Actions",
      type: "action",
      customData: (data) => (
        <Box sx={{ display: "flex", gap: "10px" }}>
          {/* Edit Button */}
          <IconButton
            sx={{
              width: 24,
              height: 24,
              backgroundColor: "rgba(244, 239, 255, 1)",
              borderRadius: "4px",
              p: "4px",
              "&:hover": { backgroundColor: "rgba(244, 239, 255, 0.8)" },
            }}
          >
            <CiEdit color="rgba(140, 98, 255, 1)" size={18} />
          </IconButton>
          <IconButton
            sx={{
              width: 24,
              height: 24,
              backgroundColor: "rgba(254, 233, 241, 1)",
              borderRadius: "4px",
              p: "4px",
              "&:hover": { backgroundColor: "rgba(254, 233, 241, 0.8)" },
            }}
          >
            <RiDeleteBinLine color="rgba(244, 78, 139, 1)" size={16} />
          </IconButton>
        </Box>
      ),
    }  ];

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
          All Todos
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

  const TopHeading = () => {
    return (
        <Typography
          variant="body1"
          fontWeight={700}
          fontSize="24px"
          lineHeight="130%"
          letterSpacing="0"
          color="rgba(17, 24, 39, 1)"
        >
          Hello, Rahul
        </Typography>
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
          Add Todos
        </Button>
      </Box>
    );
  };
  return (
    <div>
      <CommonTable<Row>
        tableStructure={columns}
        data={todos}
        loading={false}
        buttonsAtSeachLevel={ActionButtons()}
        tableName={TableName()}
        topHeading={TopHeading()}
        buttonsAtTableNameLevel={
          <Typography
          variant="body1"
          fontWeight={400}
          fontSize="14px"
          lineHeight="150%"
          letterSpacing="0.5%"
          color="rgba(17, 24, 39, 1)"
        >
          Last Login time : 16/08/2023 18:00
          </Typography>
        }

        // defaultSize={10}
        // defaultPage={1}
        removeSerialNo={true}
        handleBackend={true}
        enableSort
        removeSearch={true}
        defalutSortKey="createdAt"
      >
        <Grid container
          sx={{
            backgroundColor: "rgba(255, 255, 255, 1)",
            borderRadius: "16px",
            py: 2.5,
          }}
        >
          {statsData.map((stat, index) => (
            <Grid
              item
              xs={3}
              key={stat.label}
              pl={2}
              sx={{
                textAlign: "start",
                borderRight:
                  index !== statsData.length - 1
                    ? "1px solid rgba(0,0,0,0.1)"
                    : "none",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, fontSize: '16px', color: "rgba(33, 37, 43, 1)" }}
              >
                {stat.label}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, fontSize: '32px', color: "rgba(33, 37, 43, 1)" }}
              >
                {stat.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CommonTable>
    </div>
  );
}
