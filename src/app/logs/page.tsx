"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import LogsList from "@/components/LogsList";
import LogDetails from "@/components/LogDetails";
import { getLogs, getStats } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Stats {
  totalLogs: number;
  totalTokens: number;
  perModelStats: {
    [key: string]: {
      logs: number;
      tokens: number;
    };
  };
}

export default function Logs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedLogId, setSelectedLogId] = useState<string | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedLogs, fetchedStats] = await Promise.all([
          getLogs({
            provider,
            startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
            endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
          }),
          getStats(),
        ]);
        setLogs(fetchedLogs);
        setStats(fetchedStats);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error loading data");
        setLoading(false);
      }
    };
    fetchData();
  }, [provider, startDate, endDate]);

  const handleLogSelect = (logId: string) => {
    setSelectedLogId(logId);
  };

  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-grow">
        <div className="flex w-1/3 flex-col border-r">
          <h2 className="sticky top-0 z-10 border-b p-4 text-xl font-bold">
            Logs List
          </h2>
          <div className="space-y-2 p-4">
            <Select onValueChange={(value) => setProvider(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Start Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>End Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-grow overflow-y-auto">
            {loading ? (
              <LoadingSkeleton />
            ) : error ? (
              <p className="p-4">{error}</p>
            ) : logs.length > 0 ? (
              <LogsList
                logs={logs}
                onLogSelect={handleLogSelect}
                selectedLogId={selectedLogId}
              />
            ) : (
              <p className="p-4">No logs found.</p>
            )}
          </div>
        </div>
        <div className="flex w-2/3 flex-col">
          <h2 className="sticky top-0 z-10 border-b p-4 text-xl font-bold">
            Log Details
          </h2>
          <div className="relative flex-grow overflow-y-auto">
            <div className="absolute inset-0">
              {selectedLogId ? (
                <LogDetails logId={selectedLogId} />
              ) : (
                <p className="p-4">Select a log to view details.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
