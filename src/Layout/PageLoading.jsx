

const PageLoading = () => {
  return (
    <div className="overlay-spinner">
      <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}

export default PageLoading