import '../../App.css';
import TextField from '@material-ui/core/TextField';

export default function SearchBar({query, handleQuery}) {
    return (
      <div className="select">
        <TextField id="standard-search" label="Movie Title" type="search" onChange={handleQuery} value={query} fullWidth/>
      </div>
    );
}