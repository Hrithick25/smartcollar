// index.jsx
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <SnackbarProvider maxSnack={4} preventDuplicate>
    <App />
  </SnackbarProvider>,
  document.getElementById('root')
);
// when an alert arrives (example)
enqueueSnackbar(`${dog.name} high heart rate ${hr} bpm`, {
    variant: 'warning',
    action: (key) => (
      <>
        <button onClick={() => openProfile(dog.id)}>Open</button>
        <button onClick={() => acknowledgeAlert(alert.id)}>Ack</button>
      </>
    )
  });
  