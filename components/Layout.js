import React from "react";
import { Container } from "semantic-ui-react";
import Header from "./Header";
import "semantic-ui-css/semantic.min.css";
//HEAD COMPONENT FROM NEXTJS TO PLACE SCRIPTS, META, AND STYLES TO THE HEAD.
const Layout = (props) => {
  return (
    <Container>
      <Header />
      {props.children}
    </Container>
  );
};
export default Layout;
