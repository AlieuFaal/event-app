export type Event = {
    title: string;
    description: string | null;
    location: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    userId: string | null;
}