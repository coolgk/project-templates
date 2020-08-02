import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';

import { config } from 'src/config';
import { AppState } from 'src/redux/store';
import { actions } from 'src/redux/error';

export default function Index(): JSX.Element {
  const dispatch = useDispatch();

  const errorMessage = useSelector<AppState, string>((state) => state.error.errorMessage);

  const showError = useCallback(() => {
    dispatch(actions.showAppError(`error message: fetch ${config.api.data}`));
  }, []);

  return (
    <main>
      <Button variant="contained" onClick={showError}>
        show error
      </Button>
      <p data-testid="error-message">{errorMessage}</p>
    </main>
  );
}
