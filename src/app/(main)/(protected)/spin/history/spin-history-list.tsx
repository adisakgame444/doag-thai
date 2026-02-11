"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, X, RotateCw } from "lucide-react";
import dayjs from "@/lib/dayjs";

type SpinHistory = {
  id: string;
  slotIndex: number;
  result: string;
  prizeName: string | null;
  createdAt: string; // ISO string from server
};

interface SpinHistoryListProps {
  history: SpinHistory[];
  totalCount: number;
  winCount: number;
  loseCount: number;
  currentPage?: number;
  pageSize?: number;
}

export default function SpinHistoryList({
  history,
  totalCount,
  winCount,
  loseCount,
  currentPage = 1,
  pageSize = 20,
}: SpinHistoryListProps) {
  const winRate = totalCount > 0 ? ((winCount / totalCount) * 100).toFixed(1) : "0";

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <RotateCw className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            คุณยังไม่มีประวัติการหมุนสปิน
          </p>
          <Link href="/game">
            <Button>
              <RotateCw className="w-4 h-4 mr-2" />
              เล่นเกมสปิน
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">ทั้งหมด</p>
              <p className="text-3xl font-bold">{totalCount}</p>
              <p className="text-xs text-muted-foreground">ครั้ง</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500 bg-green-50 dark:bg-green-950">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">ชนะ</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {winCount}
              </p>
              <p className="text-xs text-muted-foreground">
                อัตราชนะ {winRate}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-500 bg-gray-50 dark:bg-gray-950">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">แพ้</p>
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                {loseCount}
              </p>
              <p className="text-xs text-muted-foreground">ครั้ง</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%] text-center">ลำดับ</TableHead>
                  <TableHead className="w-[25%] text-center">ผลลัพธ์</TableHead>
                  <TableHead className="w-[25%] text-center">รางวัล</TableHead>
                  <TableHead className="w-[25%] text-center">วันที่</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item, index) => {
                  // หน้าแรก: 1, 2, 3... 20
                  // หน้าสอง: 21, 22, 23... 40
                  const displayIndex = (currentPage - 1) * pageSize + index + 1;

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-center">
                        #{displayIndex}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.result === "WIN" ? (
                          <Badge className="bg-green-500">
                            <Trophy className="w-3 h-3 mr-1" />
                            ชนะ
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-500">
                            <X className="w-3 h-3 mr-1" />
                            ไม่ชนะ
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.prizeName || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground text-center">
                        {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
