import React from "react";
import {
    Route, 
    Switch,
} from "react-router-dom";
import { CodeBlockComponent } from "./components/code-block";

export default function Routes() {
 
  return (
        <Switch>
            <Route path={`/:pageId/:elementId`}>
                <CodeBlockComponent />
            </Route>
        </Switch>
  );
}