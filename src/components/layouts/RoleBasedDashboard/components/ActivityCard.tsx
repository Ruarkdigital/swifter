import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardConfig } from "@/config/dashboardConfig";
import { Link } from "react-router-dom";

interface ActivityComponentProps {
  activity: DashboardConfig["rows"][0]['properties'][0];
}

export const ActivityComponent: React.FC<ActivityComponentProps> = ({ activity }) => {
  return (
    <Card className="bg-white dark:bg-slate-950">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-200">
          {activity.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-auto h-[25rem]">
        {activity?.items?.map((item: any) => (
          <div
            key={item.id}
            className="space-y-1 w-full py-1.5 border-t border-gray-200 dark:border-gray-700 first:border-t-0"
          >
            <div className="mt-2 text-base text-gray-900 dark:text-gray-100">
              <span className="font-medium">{item.action || item.title}</span>
              {item.action && (
                <Link to={activity?.to ?? ''} className="underline underline-offset-4 ml-1 text-blue-900 dark:text-blue-400">
                  {item.title}
                </Link>
              )}
            </div>

            {(item.status || item.date || item.time) && (
              <div className="flex items-center gap-2 min-w-0">
                {item.status && (
                  <div className="p-1 px-3.5 rounded-full text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20">
                    <p>{item.status}</p>
                  </div>
                )}
                <div className="bg-gray-500 dark:bg-gray-400 h-1 w-1 rounded-full" />
                {item.date || item.time ? (
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {item.type} • {item.date || item.time}
                  </p>
                ) : (
                  <p className="text-xs text-gray-700 dark:text-gray-300">{item.type}</p>
                )}
              </div>
            )}

            {/* {item.time && !item.status && (
              <p className="text-xs text-gray-500">{item.time}</p>
            )} */}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};