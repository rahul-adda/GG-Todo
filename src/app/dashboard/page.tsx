"use client";
import CommonTable, { TableCellDef } from "@/ui-component/Table/CommonTable";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
type Row = {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: number;
  createdAt: string;
  enableSearch?: boolean;
  removeSearch?: boolean;
};
import { AiOutlinePlus } from "react-icons/ai";
import { TbFilter } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { useAuth } from "@/hooks/useAuth";
import { formatDate, getPaginationParams } from "@/utils/commonTable";
import { useCustomMutation, useCustomQuery } from "@/lib/QueryHooks";
import CustomDrawer from "@/ui-component/CustomDrawer";
import CreateTodoCard from "./CreateTodo";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import DeleteDialogBox from "../../ui-component/DeleteDialogBox";
import TodoDetailCard from "./TodoDetails";

// Status: 1=pending, 2=in-progress, 3=completed, 4=archived
const STATUS = {
  1: "Pending",
  2: "In Progress",
  3: "Completed",
  4: "Archived",
};

const PRIORITY = {
  1: "Low",
  2: "Medium",
  3: "High",
  4: "Critical",
};

const statsData = [
  { label: "All Todos", value: 12 },
  { label: "Upcoming", value: 4 },
  { label: "Completed", value: 6 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [id, setId] = useState("");
  const [detailCardOpen, setDetailCardOpen] = useState(false);
  const [todo, setTodo] = useState<Row>();

  const searchParams = useSearchParams();
  const pagination = getPaginationParams(searchParams);

  const params = {
    limit: pagination.limit,
    page: pagination.page,
    userId: user?._id,
  };

  let queryKey = ["todo_list", params];

  const { mutation, queryClient } = useCustomMutation({
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["todo_list"],
      });
    },
  });

  const { data, isPending, isFetching, ...rest } = useCustomQuery({
    queryProps: {
      queryKey: queryKey.filter(Boolean),
      enabled: !!user?._id,
    },
    payload: {
      url: `todo`,
      params,
    },
  });

  const handleDeleteClick = (id: string) => {
    setId(id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    mutation.mutate({
      method: "DELETE",
      wantToast: true,
      url: `todo/${id}`,
    });
    setIsDialogOpen(false);
    setDetailCardOpen(false)
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleUpdateTodo = (updatedTodo: any) => {
    mutation.mutate({
      method: "PUT",
      wantToast: true,
      url: `todo/${updatedTodo._id}`,
      todoId: updatedTodo._id,
      data: updatedTodo,
    },
  );
  };

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
              color: "rgba(33, 37, 43, 1)",
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
              color: "rgba(152, 159, 171, 1)",
            }}
          >
            {row.description}
          </span>
        </div>
      ),
    },
    {
      headName: "Due Date",
      key: "dueDate",
      enableSort: true,
      customData: (data) => formatDate(data?.dueDate),
    },
    {
      headName: "Status",
      key: "status",
      enableSort: true,
      customData: (data) => (
        <Box
          sx={{
            backgroundColor:
              data?.status === 3
                ? "rgba(231, 247, 239, 1)"
                : data?.status === 1
                ? "rgba(255, 235, 59, 0.2)"
                : "rgba(255, 208, 35, 0.2)",
            color:
              data?.status === 3
                ? "rgba(12, 175, 96, 1)"
                : data?.status === 1
                ? "rgba(228, 180, 1, 1)"
                : "rgba(228, 180, 1, 1)",
            fontWeight: 400,
            fontSize: "10px",
            letterSpacing: "0.5%",
            px: "8px",
            py: "2px",
            borderRadius: "20px",
            display: "inline-block",
            textAlign: "center",
          }}
        >
          {data?.status === 3
            ? "Completed"
            : data?.status === 1
            ? "Upcoming"
            : "In Progress"}
        </Box>
      ),
    },
    {
      headName: "Actions",
      type: "action",
      customData: (data) => (
        <Box sx={{ display: "flex", gap: "10px" }}>
          <IconButton
            onClick={()=> {
              setTodo(data)
              setDetailCardOpen(true)
            }}
            sx={{
              width: 24,
              height: 24,
              backgroundColor: "rgba(244, 239, 255, 1)",
              borderRadius: "4px",
              p: "4px",
              "&:hover": { backgroundColor: "rgba(244, 239, 255, 0.8)" },
            }}
          >
            <CiEdit color="rgba(140, 98, 255, 1)" size={20} />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteClick(data._id)}
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
    },
  ];

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
          Last Updated : {formatDate(user?.lastLogin)}
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
        textTransform={"capitalize"}
      >
        Hello, {user?.name}
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
            boxShadow: "none",
          }}
        >
          Filter
        </Button>

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
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
            boxShadow: "none",
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
        totalDataCount={data?.total || 0}
        data={data?.todos}
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
            Last Login time : {formatDate(user?.lastLogin)}
          </Typography>
        }
        loading={isPending && isFetching}
        isFetching={isFetching}
        isStale={rest?.isStale}
        // removeSerialNo={true}
        handleBackend={true}
        enableSort
        removeSearch={true}
        defalutSortKey="createdAt"
      >
        <Grid
          container
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
                sx={{
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "rgba(33, 37, 43, 1)",
                }}
              >
                {stat.label}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "32px",
                  color: "rgba(33, 37, 43, 1)",
                }}
              >
                {stat.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CommonTable>
      <CustomDrawer open={open} onClose={() => setOpen(false)} title="Add Todo">
        <CreateTodoCard setOpen={(open: boolean) => setOpen(open)} />
      </CustomDrawer>
      {isDialogOpen && (
        <DeleteDialogBox
          delete={() => handleDelete(id)}
          open={true}
          handleClose={handleClose}
        />
      )}
      <CustomDrawer
        open={detailCardOpen}
        onClose={() => setDetailCardOpen(false)}
        title="Todo Details"
      >
        {todo && (
          <TodoDetailCard
            todo={todo}
            onDelete={handleDelete}
            onUpdate={handleUpdateTodo}
          />
        )}
      </CustomDrawer>
    </div>
  );
}
