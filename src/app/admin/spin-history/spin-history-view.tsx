"use client";

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
import { SpinHistory } from "@/generated/prisma/client";
import { Trophy, X } from "lucide-react";

interface SpinHistoryAdminViewProps {
  history: (SpinHistory & {
    user: {
      id: string;
      name: string;
      email: string;
    };
  })[];
}

function getResultBadge(result: string) {
  if (result === "WIN") {
    return (
      <Badge variant="default" className="bg-green-500">
        <Trophy className="w-3 h-3 mr-1" />
        ชนะ
      </Badge>
    );
  }
  return (
    <Badge variant="secondary">
      <X className="w-3 h-3 mr-1" />
      ไม่ชนะ
    </Badge>
  );
}

export default function SpinHistoryAdminView({
  history,
}: SpinHistoryAdminViewProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-sm sm:text-base text-muted-foreground">ยังไม่มีประวัติการหมุนสปิน</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile/Tablet View - Card Layout */}
      <div className="block md:hidden space-y-3 sm:space-y-4">
        {history.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-4 sm:pt-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">
                      {item.user.name}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {item.user.email}
                    </p>
                  </div>
                  {getResultBadge(item.result)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                  <div>
                    <p className="text-muted-foreground">วันที่/เวลา</p>
                    <p className="font-medium">
                      {new Date(item.createdAt).toLocaleString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ตำแหน่ง</p>
                    <p className="font-medium">ตำแหน่งที่ {item.slotIndex + 1}</p>
                  </div>
                </div>

                {item.prizeName && (
                  <div className="pt-2 border-t">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">รางวัล</p>
                    <p className="text-sm sm:text-base text-green-600 dark:text-green-400 font-medium break-words">
                      {item.prizeName}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop View - Table Layout */}
      <Card className="hidden md:block">
        <CardContent className="pt-6 p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px]">วันที่/เวลา</TableHead>
                  <TableHead className="min-w-[120px]">ลูกค้า</TableHead>
                  <TableHead className="min-w-[180px]">อีเมล</TableHead>
                  <TableHead className="min-w-[100px]">ตำแหน่ง</TableHead>
                  <TableHead className="min-w-[100px]">ผลลัพธ์</TableHead>
                  <TableHead className="min-w-[120px]">รางวัล</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="font-medium">{item.user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.user.email}
                    </TableCell>
                    <TableCell>ตำแหน่งที่ {item.slotIndex + 1}</TableCell>
                    <TableCell>{getResultBadge(item.result)}</TableCell>
                    <TableCell>
                      {item.prizeName ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {item.prizeName}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
