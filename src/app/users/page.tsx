"use client";
import { useAuth } from "@/hooks/useAuth";
import { useCustomMutation, useCustomQuery } from "@/lib/QueryHooks";
import MySwitch from "@/ui-component/MySwitch";
import CommonTable, { TableCellDef } from "@/ui-component/Table/CommonTable";
import { formatDate } from "@/utils/commonTable";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
type Row = {
  name: string;
  email: string;
  role: number;
  todosCount: number;
  createdAt: string;
  enableSearch?: boolean;
  removeSearch?: boolean;
  status: boolean;
  _id: string;
};
import { AiOutlinePlus } from "react-icons/ai";
import { TbFilter } from "react-icons/tb";
import CreateUserCard from "./CreateUser";
import CustomDrawer from "@/ui-component/CustomDrawer";

export default function DashboardPage() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const { mutation, queryClient } = useCustomMutation({
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["user_list"],
      });
    },
  });

  const { data, isPending, isFetching, ...rest } = useCustomQuery({
    queryProps: {
      queryKey: ["user_list"],
    },
    payload: {
      url: "user",
    },
  });

  const handleSwitch = (userId: string, status: boolean) => {
    mutation.mutate({
      method: "PUT",
      wantToast: true,
      url: `user/${userId}`,
      userId,
      data: {
        status,
      },
    });
  };

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
              color: "rgba(33, 37, 43, 1)",
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
              color: "rgba(152, 159, 171, 1)",
            }}
          >
            {row.email}
          </span>
        </div>
      ),
    },
    {
      headName: "Role",
      key: "role",
      customData: (data) => (data.role === 1 ? "Super Admin" : "Viewer"),
    },
    {
      headName: "Actions",
      type: "action",
      customBody: (rowData) => {
        return (
          <MySwitch
            loading={
              mutation.isPending && mutation.variables?.userId === rowData._id
            }
            checked={rowData.status}
            onChange={(e) => handleSwitch(rowData._id, e.target.checked)}
          />
        );
      },
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
          Last Updated : {formatDate(user?.lastLogin)}
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
          Add Users
        </Button>
      </Box>
    );
  };
  return (
    <div>
      <CommonTable<Row>
        tableStructure={columns}
        data={data?.users}
        totalDataCount={data?.total || 0}
        buttonsAtSeachLevel={ActionButtons()}
        tableName={TableName()}
        // reFetch={rest.refetch}
        // defaultSize={10}
        // defaultPage={1}
        loading={isPending && isFetching}
        isFetching={isFetching}
        isStale={rest?.isStale}
        // reFetch={rest?.refetch}
        // removeSerialNo={true}
        handleBackend={true}
        enableSort
        removeSearch={true}
      />
      <CustomDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Create User"
      >
        <CreateUserCard setOpen={(open: boolean) => setOpen(open)} />
      </CustomDrawer>
    </div>
  );
}
