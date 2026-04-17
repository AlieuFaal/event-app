import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { apiClient } from '@/lib/api-client';
import { authClient } from '@/lib/auth-client';
import { queryClient } from '@/app/_layout';

type FavoriteEventResponse = {
    event: {
        id: string;
    };
};

export function useFavoriteEvent(eventId: string | undefined) {
    const session = authClient.useSession();

    const favoriteEvent = useMutation({
        mutationFn: async (eventId: string) => {
            return apiClient.events.favorites[":eventId"].$post({ param: { eventId } });
        },
        onSuccess: () => {
            console.log('Event saved or deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['favoriteEvent', eventId, session.data?.user?.id] });
            queryClient.invalidateQueries({ queryKey: ['favoriteEvents', session.data?.user?.id] });
        },
        onError: (error) => {
            console.error('Error saving or deleting event:', error);
        }
    });

    const { data: isFavorited = false } = useQuery({
        queryKey: ['favoriteEvent', eventId, session.data?.user?.id],
        queryFn: async () => {
            if (!eventId || !session.data?.user?.id) return false;

            const res = await apiClient.events.favorites[':userid'].$get({
                param: { userid: session.data.user.id }
            });

            if (res.ok) {
                const events = await res.json() as FavoriteEventResponse[];
                return events.some((item) => item.event.id === eventId);
            }
            return false;
        },
        enabled: !!eventId && !!session.data?.user?.id,
    });

    const handleSaveEvent = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        console.log("Save Event pressed");

        if (eventId) {
            favoriteEvent.mutate(eventId);
        }
    }, [eventId, favoriteEvent]);

    return { handleSaveEvent, isFavorited };
}
