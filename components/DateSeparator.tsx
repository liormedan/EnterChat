import { format } from "date-fns";

export default function DateSeparator({ date }: { date: string }) {
    return (
        <div className="flex items-center justify-center my-4">
            <div className="bg-gray-200 dark:bg-gray-800 text-xs text-gray-500 px-3 py-1 rounded-full">
                {format(new Date(date), "MMMM d, yyyy")}
            </div>
        </div>
    );
}
