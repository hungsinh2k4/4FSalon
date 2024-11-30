import { useState } from "react";
import Star from "./Star";

interface RatingProps {
    totalStars?: number;
    initialRating?: number;
    changeable?: boolean;
    text?: string;
    onRatingChange?: (value: number) => void;
}

const Rating: React.FC<RatingProps> = ({ totalStars = 5, initialRating = 0, changeable: changable = true, text, onRatingChange }) => {
    const [rating, setRating] = useState<number>(initialRating);
    const [hoverRating, setHoverRating] = useState<number>(0);

    const handleRating = (value: number) => {
        if (!changable) return;

        setRating(value);
        if (onRatingChange) {
            onRatingChange(value);
        }
    }

    const handleHover = (value: number) => {
        if (!changable) return;
        setHoverRating(value);
    }

    return (
        <div className="flex items-center justify-center">
        <div className="flex">
            {[...Array(totalStars)].map((_, index) => (
                <Star key={index} 
                fill={index < rating || index < hoverRating} 
                onClick={() => handleRating(index + 1)} 
                onHover={() => handleHover(index + 1)}
                onLeave={() => setHoverRating(rating)}
                />
            ))}
        </div>
        <span className="ml-2 text-gray-600">{text && text}</span>
        </div>
    );
}

export default Rating;