import { lazy, Suspense, useEffect, useState, useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Content/Home";
import { sessionstorageGet } from "../Config/Constant";
import { AdminMenu, OperatorMenu } from "../Config/MenuList";
import PageNotFound from "../Content/PageNotFound";
import PropTypes from "prop-types";
import PageLoading from "../Components/PageLoading";

const Content = ({show}) => {
  const [dynamicContent, setDynamicContent] = useState([]);
  const role =  sessionstorageGet({key: 'Role_id'})

  useEffect(() => {
    if(role === '1'){
      setDynamicContent(AdminMenu);
    } else if(role === '2'){
      setDynamicContent(OperatorMenu);
    } else {
      setDynamicContent([])
    }
  },[])

  
  const loadComponent = (elementString) => {
    const Component = lazy(() => 
      import(`../Content/${elementString}.jsx`).catch(() => {
        return import('../Content/PageNotFound');
      })
    );
    
    return (
      <Suspense fallback={
        <PageLoading/>
      }>
        <Component />
      </Suspense>
    );
  };

  const dynamicRoutes = useMemo(() => {
    return dynamicContent ? dynamicContent.flatMap(menu => {
      return [{
        path: menu.menuLink,
        element: loadComponent(menu.menuElement)
      }]
    }) : [];
  }, [dynamicContent]);

  const renderRoutes = () => {
    return dynamicRoutes.map(route => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))
  }

  return (
    <div 
      className="h-100"
      style={{
        marginLeft: show ? '250px' : '0px', width: show ? 'calc(100% - 250px)' : '100%'
      }}
    >
        <Routes>
          <Route path="/" element={<Home />} />
          {renderRoutes()}
          <Route path="*" element={<PageNotFound/>}/>
        </Routes>
    </div>
  );
};

Content.propTypes = {
  show: PropTypes.bool
}

export default Content;
