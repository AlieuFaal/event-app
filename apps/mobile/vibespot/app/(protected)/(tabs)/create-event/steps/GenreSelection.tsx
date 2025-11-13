import { UseFormReturn, Controller } from 'react-hook-form';
import { View } from 'react-native';
import { eventInsertSchema, genres } from '@/schemas/ZodSchemas';
import { GenreCard } from '@/components/event-creation-components/GenreCard';
import z from 'zod';

interface Props {
    form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
}

export function GenreSelection({ form }: Props) {

    const getColorForGenre = (genre: string) => {
        switch (genre) {
            case 'Hip-Hop':
            case 'R&B':
            case 'Soul':
            case 'Funk':
            case 'Jazz':
            case 'Gospel':
                return 'Purple';
            case 'Rock':
            case 'Metal':
            case 'Punk':
            case 'Hard Rock':
            case 'Grunge':
                return 'Red';
            case 'Indie':
            case 'Alternative':
            case 'Acoustic':
            case 'Classical':
                return 'Yellow';
            case 'Pop':
            case 'Disco':
            case 'Synthpop':
            case 'Electronic':
            case 'Techno':
            case 'Blues':
                return 'Blue';
            case 'House':
            case 'Trance':
            case 'Dubstep':
                return 'Orange';
            case 'Country':
            case 'Folk':
            case 'Reggae':
            case 'Afrobeat':
                return 'Green';
            default:
                return 'Blue';
        }
    };

    const selectedGenre = form.watch('genre');

    return (
        <View className='flex-1'>
            <Controller
                control={form.control}
                name="genre"
                render={({ field }) => (
                    <View className="flex-row flex-wrap justify-evenly">
                        {genres.map(genre => (
                            <GenreCard
                                key={genre}
                                genre={genre}
                                selected={field.value === genre}
                                onPress={() => {
                                    field.onChange(genre);
                                    console.log('Selected genre:', genre);

                                    form.setValue('color', getColorForGenre(genre));
                                    console.log('Set color to:', getColorForGenre(genre));
                                }}
                            />
                        ))}
                    </View>
                )}
            />
        </View>
    );
}