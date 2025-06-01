

const PageLoading = () => {
  return (
    <div className="d-flex justify-content-center align-items-center bg-dark bg-opacity-50 rounded rounded-5" style={{ height: '200px' }}>
       <div className="d-flex">
      <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
    </div>
   
  )
}

export default PageLoading