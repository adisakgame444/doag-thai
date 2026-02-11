"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  approveUserToWinAction,
  revokeUserWinAction,
  deleteUserSpinConfigAction,
} from "./actions";
import { CheckCircle2, XCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type User = {
  id: string;
  name: string;
  email: string;
  spinQuota: {
    total: number;
    used: number;
    status: string;
  } | null;
  spinConfig: {
    canWin: boolean;
    forceWin: boolean;
    winCooldown: number;
    spinCount: number;
    disabledSpin: boolean;
  } | null;
};

export default function SpinUsersView({ users }: { users: User[] }) {
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleApproveClick = async (userId: string) => {
    setLoading(true);
    const result = await approveUserToWinAction(userId);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      window.location.reload();
    } else {
      toast.error(result.message);
    }
  };

  const handleRevokeClick = async (userId: string) => {
    setLoading(true);
    const result = await revokeUserWinAction(userId);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      window.location.reload();
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setLoading(true);
    const result = await deleteUserSpinConfigAction(userToDelete.id);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      window.location.reload();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <>
      {/* Mobile/Tablet View - Card Layout */}
      <div className="block md:hidden space-y-3 sm:space-y-4">
        {users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">ไม่มีผู้ใช้</p>
          </div>
        ) : (
          users.map((user) => (
            <Card key={user.id}>
              <CardContent className="pt-4 sm:pt-6">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm sm:text-base truncate">{user.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div>
                      <p className="text-muted-foreground">สิทธิ์หมุน</p>
                      {user.spinQuota ? (
                        <p className="font-medium">
                          {user.spinQuota.used} / {user.spinQuota.total}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">-</p>
                      )}
                    </div>
                    <div>
                      <p className="text-muted-foreground">สถานะ</p>
                      <div className="mt-1">
                        {user.spinConfig?.disabledSpin ? (
                          <Badge variant="destructive" className="text-xs">ปิดใช้งาน</Badge>
                        ) : user.spinConfig?.canWin ? (
                          <Badge className="bg-green-500 text-xs">อนุมัติชนะ</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">ไม่อนุมัติ</Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">จำนวนหมุน</p>
                      <p className="font-medium">{user.spinConfig?.spinCount ?? 0} ครั้ง</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs sm:text-sm font-medium mb-2">การจัดการ</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-xs"
                        onClick={() => handleApproveClick(user.id)}
                        disabled={loading || user.spinConfig?.canWin}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        อนุมัติชนะ
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950 text-xs"
                        onClick={() => handleRevokeClick(user.id)}
                        disabled={loading || !user.spinConfig?.canWin}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        ยกเลิก
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 text-xs"
                        onClick={() => handleDeleteClick(user)}
                        disabled={loading}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        ลบ
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Desktop View - Table Layout */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%] text-center">ผู้ใช้</TableHead>
              <TableHead className="w-[15%] text-center">สิทธิ์หมุน</TableHead>
              <TableHead className="w-[15%] text-center">สถานะ</TableHead>
              <TableHead className="w-[15%] text-center">จำนวนหมุน</TableHead>
              <TableHead className="w-[35%] text-center">การจัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  ไม่มีผู้ใช้
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {user.spinQuota ? (
                      <div className="text-sm">
                        <div>
                          ใช้แล้ว: {user.spinQuota.used} / {user.spinQuota.total}
                        </div>
                        <div className="text-muted-foreground">
                          เหลือ: {user.spinQuota.total - user.spinQuota.used}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col gap-1 items-center">
                      {user.spinConfig?.disabledSpin ? (
                        <Badge variant="destructive">ปิดใช้งาน</Badge>
                      ) : user.spinConfig?.canWin ? (
                        <Badge className="bg-green-500">อนุมัติชนะ</Badge>
                      ) : (
                        <Badge variant="secondary">ไม่อนุมัติ</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {user.spinConfig?.spinCount ?? 0} ครั้ง
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 flex-wrap justify-center">
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => handleApproveClick(user.id)}
                        disabled={loading || user.spinConfig?.canWin}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        อนุมัติชนะ
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950"
                        onClick={() => handleRevokeClick(user.id)}
                        disabled={loading || !user.spinConfig?.canWin}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        ยกเลิก
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                        onClick={() => handleDeleteClick(user)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        ลบ
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบ</DialogTitle>
            <DialogDescription>
              คุณต้องการลบการตั้งค่าสปินของ{" "}
              <span className="font-semibold">
                {userToDelete?.name} ({userToDelete?.email})
              </span>{" "}
              หรือไม่?
              <br />
              <span className="text-red-500 font-medium">
                การกระทำนี้ไม่สามารถยกเลิกได้
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600"
            >
              {loading ? "กำลังลบ..." : "ลบ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
