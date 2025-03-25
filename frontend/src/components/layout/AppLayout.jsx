/* eslint-disable no-unused-vars */
const AppLayout = (WrappedComponent) => {
    return (props) => {
      return (
        <div>
          <div>Header</div>
          <WrappedComponent {...props} />
          <div>Footer</div>
        </div>
      );
    };
  };
  
  export default AppLayout;
  