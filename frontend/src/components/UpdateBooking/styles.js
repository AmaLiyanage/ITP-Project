export const styles = {
  container: {
    display: 'flex',
    padding: '20px',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    height: '90vh',
    minHeight: '600px'
  },
  
  form: {
    flex: '0 0 350px',
    padding: '25px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxHeight: '100%',
    overflowY: 'auto'
  },

  mapWrapper: {
    flex: '1',
    minWidth: '0',
    borderRadius: '12px',
    overflow: 'hidden'
  },

  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },

  input: {
    width: '100%',
    padding: '12px 15px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.3s',
    outline: 'none'
  },

  button: {
    width: '100%',
    padding: '12px 15px',
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '5px'
  },

  infoCard: {
    backgroundColor: '#f8f9fa',
    padding: '15px 20px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0'
  },

  infoText: {
    fontSize: '14px',
    color: '#333',
    margin: '8px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  title: {
    fontSize: '22px',
    color: '#333',
    margin: '0 0 20px 0',
    fontWeight: '600',
    textAlign: 'center'
  },

  map: {
    width: '100%',
    height: '100%',
    borderRadius: '12px'
  }
}; 