import '../../App.css';
import MovieCard from '../card/MovieCard'

export default function List({ items, type, onSelect }) {
    return (
        <div className="items-list">
            <h3 className="subtitle">{type}</h3>
            <ul>
                {
                    items && items.map((movie, i) =>
                    (
                        <MovieCard movie={movie} buttonText={type === 'Nominations' ? "Remove" : "Nominate"} onSelect={onSelect} />
                    )
                    )
                }
            </ul>
        </div>
    )
}