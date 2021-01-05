import '../styles/App.css';
import TextField from '@material-ui/core/TextField';
import ShoppyConstants from '../constants/constants';

export default function SearchBar({query, handleQuery}
  : {query: string, handleQuery: any}) {
    return (
      <div className="select-container">
        <TextField variant="outlined" id="search" label={ShoppyConstants.SEARCH_PLACEHOLDER} type="search" onChange={handleQuery} value={query} fullWidth/>
      </div>
    );
}