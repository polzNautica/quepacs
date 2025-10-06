import React, { useEffect, useState, useMemo, useImperativeHandle, forwardRef } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
} from "@heroui/react";
import { useAuthStore } from "@/stores/auth-store";

const SubscriptionsTable = forwardRef((props, ref) => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    if (user) {
      checkSubscriptions();
    }
  }, [user]);

  useImperativeHandle(ref, () => ({
    refreshSubscriptions() {
      checkSubscriptions();
    },
  }));

  const checkSubscriptions = async () => {
    try {
      const response = await fetch("/api/push/debug");
      const data = await response.json();
      // console.log("Debug info:", data);
      setDebugInfo(data);
    } catch (error) {
      console.error("Failed to fetch debug info:", error);
    }
  };

  const pages = useMemo(() => {
    if (!debugInfo || !debugInfo.totalSubscriptions) return 1;
    return Math.ceil(debugInfo.totalSubscriptions / rowsPerPage);
  }, [debugInfo]);

  const items = useMemo(() => {
    if (!debugInfo?.subscriptions) return [];
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return debugInfo.subscriptions.slice(start, end);
  }, [page, debugInfo]);

  return (
    <Table
      aria-label="Subscription table with pagination"
      topContent={
        <div>
          <h3 className="font-semibold mb-2">Debug Information</h3>
          Total Subscriptions in DB:{" "}
          <strong>{debugInfo?.totalSubscriptions}</strong>
        </div>
      }
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            showShadow
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
      classNames={{
        wrapper: "min-h-[222px]",
      }}
    >
      <TableHeader>
        <TableColumn key="userId">User ID</TableColumn>
        <TableColumn key="createdAt">Created At</TableColumn>
      </TableHeader>
      <TableBody items={items}>
        {(item: any) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
});

export default SubscriptionsTable;
