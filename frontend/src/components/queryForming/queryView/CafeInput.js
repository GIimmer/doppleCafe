import React, { useState } from 'react'
import { connect } from 'react-redux'
import useAutocomplete from '../../../utilities/useAutocomplete'
import { selectCafeOptionFunc } from "../../../actions/queryActions"
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CircularProgress } from '@material-ui/core'


function preparePredictions(predictions) {
    return predictions && predictions.map(prediction => {
       prediction.invalidInput = !prediction.types.some(val => val === 'cafe');
       return prediction;
    });
}

function selectCafe(predictions, event, input) {
   event.preventDefault();

   if (typeof input === 'string') {
      const firstValidCafe = predictions.find(prediction => !prediction.invalidInput);
      firstValidCafe && this.selectCafeOption(firstValidCafe.place_id);

   } else {
      input && this.selectCafeOption(input.place_id);
   }
}

export function CafeInput(props) {
   const [input, setInput] = useState("");
   const [loading, setLoading] = useState(false);
   const predictions = useAutocomplete(input, setLoading);
   const preparedPredictions = preparePredictions(predictions);

   return (
      <div className="margin50">
         <Autocomplete
            freeSolo
            style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
            options={preparedPredictions}
            getOptionLabel={prediction => prediction.description || ''}
            getOptionDisabled={option => option.invalidInput}
            onChange={selectCafe.bind(props, preparedPredictions)}
            renderInput={(params) => (
               <>
                  <TextField
                     onChange={e => setInput(e.target.value)}
                     {...params}
                     label="Search for a cafe you know you like"
                     style={{display: 'inline-block'}}
                     margin="normal"
                     value={input}
                     variant="outlined"
                  />
                  {
                     loading &&
                     <CircularProgress size="2em" style={{ position: 'absolute', right: '15px', marginTop: '8px' }}/>
                  }
               </>
            )}
         />        
      </div>
   )
}

function mapDispatchToProps(dispatch) {
   return {
      selectCafeOption: selectCafeOptionFunc(dispatch),
   }
}

export default connect(() => ({}), mapDispatchToProps)(CafeInput);
