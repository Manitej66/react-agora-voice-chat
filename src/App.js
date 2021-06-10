import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Page from "@geist-ui/react/esm/page";
import Home from "./components/Home";
import Login from "./components/Login";
import PrivateRoute from "./utils/PrivateRoute";
import Navbar from "./utils/Navbar";
import Join from "./components/Join";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Page size="small">
          <Page.Header style={{ padding: 0.1 }}>
            <Navbar />
          </Page.Header>
          <Page.Content
            style={{ padding: 0, maxHeight: "80vh", overflow: "hidden" }}
          >
            <PrivateRoute path="/" exact component={Home} />
            <PrivateRoute path="/join/:id" exact component={Join} />
            <Route path="/login" component={Login} />
          </Page.Content>
        </Page>
      </Router>
    </AuthProvider>
  );
};

export default App;
