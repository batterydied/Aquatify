import { format } from "date-fns";

export function dateFormatting(unformattedDate: string){
    return format(new Date(unformattedDate), "MMM d, yyyy");
}