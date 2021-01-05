/**
 * Movie Card Component - renders movie information and nominate/remove button.
 */

import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles'
import Collapse from '@material-ui/core/Collapse';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ListType } from '../constants/button';
import { Movie } from '../models/movie';
import '../styles/App.css';

const useStyles = makeStyles((theme) => ({
    root: {
    //   maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
      },
      expandOpen: {
        transform: 'rotate(180deg)',
      },
  }));

export default function MovieCard({movie, type, onSelect }
    : {movie: Movie, type: ListType, onSelect: any}) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    
    const buttonText = type;

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <li className="list-item">
            <Card className={classes.root}>
                <CardHeader
                    title={movie.title}
                    subheader={movie.year}
                />
                    <Button variant="contained" disabled={movie.disabled} onClick={() => onSelect(movie)}>
                        {buttonText}
                    </Button>
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                        >
                        <ExpandMoreIcon />
                    </IconButton>
                {/* Show movie poster when user selects "show more" */}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                    <CardMedia
                        className={classes.media}
                        image={movie.poster}
                        title={movie.title}
                    />
                    </CardContent>
                </Collapse>
            </Card>
        </li>
    )
}