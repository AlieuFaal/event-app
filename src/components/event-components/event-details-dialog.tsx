import { Button } from "src/components/shadcn/ui/button.tsx"
// import {
//     Dialog,
//     DialogClose,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/shadcn/ui/dialog"
// import { Input } from "@/components/shadcn/ui/input"
// import { Label } from "@/components/shadcn/ui/label"
// import { User, Event } from "./event-list"


// export function EventDetailsDialog({ event, users }: { event: Event, users: User[] }) {

//         function getEventCreatorName(event: Event) {
    
//             const creator = users.find((user) => user.id === event.userId);
    
//             return creator ? creator.name : "Unknown";
//         }
//     return (
//         <Dialog>
//                 <DialogContent className="sm:max-w-[800px] text-card-foreground bg-card">
//                     <DialogHeader className="items-center">
//                         <DialogTitle className="text-6xl">{event.title}</DialogTitle>
//                         <DialogDescription className="text-xl">
//                             {event.description}
//                         </DialogDescription>
//                     </DialogHeader>
//                     <div className="grid gap-10 mb-5">
//                         <div className="grid gap-3">
//                             <Label htmlFor="username-1" className="text-xl">Location: {event.location}</Label>
//                         </div>
//                         <div className="grid gap-3">
//                             <Label htmlFor="username-1" className="text-xl">Date: {event.startDate.toUTCString() + "-" + event.endDate.toUTCString() }</Label>
//                         </div>
//                         <div className="grid gap-3">
//                             <Label htmlFor="username-1" className="text-xl">Created by:{getEventCreatorName(event)}</Label>
//                         </div>
//                     </div>
//                 </DialogContent>
//         </Dialog>
//     )
// }
