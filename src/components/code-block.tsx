import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import {
  useParams
} from "react-router-dom";
import { api } from '../service/api';
import * as S from './styled';


type DataSchema = {
  code: string;
  includeFbml: boolean;
  includeSwfObject: boolean;
}

type RouteParamsSchema = {
  pageId: string;
  elementId: string;
}

export interface Content {
  minWidth?: any;
  maxWidth?: any;
  minHeight?: any;
  maxHeight?: any;
  isEmpty?: boolean;
  name?: string;
  widgetType?: string;
  pageId?: number;
  id?: string;
  variationId?: number;
  elementIndex?: string;
  elementId?: string;
  parameters?: any[];
  code?: string;
  includeFbml?: boolean;
  includeSwfObject?: boolean;
}

export interface DataModel {
  id: string;
}

export interface BackgroundImage {
  id: string;
  isEmpty: boolean;
  imageId: number;
  dimX: number;
  dimY: number;
  width: number;
  height: number;
  imageShouldBeOptimized: boolean;
  baseUrl: string;
  hostName: string;
  pageId: number;
  variationId: number;
  elementType: string;
  elementIndex: string;
  elementId: string;
  parentId: string;
  name?: any;
  cropX?: any;
  cropY?: any;
}

export interface Style {
  __type: string;
  isEmpty: boolean;
  dataModel: DataModel;
  backgroundImage: BackgroundImage;
  id: string;
  pageId: number;
  variationId: number;
  elementType: string;
  elementIndex: string;
  elementId: string;
  parentId: string;
}

export interface RootObject {
  content?: Content;
  elementTypeName?: string;
  __type?: string;
  pageId?: number;
  elementType?: string;
  variationId?: number;
  elementIndex?: string;
  hasContent?: boolean;
  style?: Style;
  requestedAt?: Date;
  id?: string;
  elementId?: string;
  elementTypeFriendlyName?: string;
  canDelete?: boolean;
  parentId?: string;
}

export const CodeBlockComponent = (): JSX.Element => {
  const { pageId,elementId } = useParams<RouteParamsSchema>()
  const { register, handleSubmit, control, watch } = useForm<DataSchema>();
  const [schema, setSchema] = useState<RootObject>();

  const watchCode = watch("code");
  const watchIncludeFbml = watch("includeFbml" );
  const watchIncludeSwfObject = watch("includeSwfObject");


  useEffect(() => {
    const handler = (event: any) => {
      if(event.data.type === "codeBlock") {
        const codeBlockSchema =  JSON.parse(event.data.payload);

        // console.log(codeBlockSchema)
        setSchema(codeBlockSchema)
      }
      
    }

    window.addEventListener("message", handler, false)

    // clean up
    return () => window.removeEventListener("message", handler, false)
  }, []) // empty array => run only once

useEffect(() => {
  setSchema(prevState => ({...prevState, content: {
    ...prevState?.content,
    code: watchCode,
    includeFbml: watchIncludeFbml,
    includeSwfObject: watchIncludeSwfObject
  }}))
}, [watchCode, watchIncludeFbml, watchIncludeSwfObject])
  
  const onSubmit = async () => {
    console.log(schema)
    api.post(`/admin/api/pages/${pageId}/elements/widgets/${elementId}/view?asAdvanced=Y`, 
    schema, 
    {
      headers: {
        cookies: "ajs_anonymous_id=d94366c1-06bf-469d-9281-7856eaa9704f; ixp__cookie-consent=9/24/2021 9:26:12 PM; _ga=GA1.2.528923778.1632518824; ajs_user_id=dev; ss-pid=gkDr1EOZqefDzHu/BFuV; _gid=GA1.2.185710466.1633350588; ASP.NET_SessionId=v3bwxvutrosmepiofshicb5r; LiveBallAuth=1057170D5B849F6D7DD60E1939ABD0E8DC3963F59F42FF81DE27A7751AF84A7CA2ED2806AA74E6E655247254364EB2AB8CB883956653D7C733AB6991A4CFB87D2265CF6760F88584215594CD5A296D90BFE42B711C14DF09955FF783DC35367B; ss-id=PSlW/R9rzsu6xMgi8fxQ; _gat=1"
      }
    })
    .then(()=> console.log("save with success"))
    .catch(error => console.log(JSON.stringify(error)))


    // api.get(
    //   "/admin/api/pages/2?asAdvanced=Y", {
    //       headers: {
    //         cookies: "ajs_anonymous_id=d94366c1-06bf-469d-9281-7856eaa9704f; ixp__cookie-consent=9/24/2021 9:26:12 PM; _ga=GA1.2.528923778.1632518824; ajs_user_id=dev; ss-pid=gkDr1EOZqefDzHu/BFuV; _gid=GA1.2.185710466.1633350588; ASP.NET_SessionId=v3bwxvutrosmepiofshicb5r; LiveBallAuth=1057170D5B849F6D7DD60E1939ABD0E8DC3963F59F42FF81DE27A7751AF84A7CA2ED2806AA74E6E655247254364EB2AB8CB883956653D7C733AB6991A4CFB87D2265CF6760F88584215594CD5A296D90BFE42B711C14DF09955FF783DC35367B; ss-id=PSlW/R9rzsu6xMgi8fxQ; _gat=1"
    //       }
    //     }
    // ).then((result)=> console.log("get with success", result))
    // .catch(error => console.log(JSON.stringify(error)))
  };


  
  return (
  <S.CodeWrapper>
    <form onSubmit={handleSubmit(onSubmit)}>
      <S.TitleWrapper>HTML/script:</S.TitleWrapper>
      {/* <S.TitleWrapper>pageid - {pageId}</S.TitleWrapper>
      <S.TitleWrapper>elementId - {elementId}</S.TitleWrapper> */}
     
      <Controller
        name="code"
        control={control}
        render={({ field }) =>  (
          <CodeMirror
            value={field.value}
            height="200px"
            extensions={[javascript({ jsx: true })]}
            theme="dark"
            onChange={(value, viewUpdate) => {
              field.onChange(value);
            }}
            autoFocus={true}
            
          />
        )}
      />
      <S.CheckBoxWrapper>
        <div className="form-group form-check">
          <input type="checkbox" {...register('includeFbml')} id="includeFbml" />
          <label htmlFor="includeFbml">Automatically include support for Facebook FBML via  tag</label>
        </div>
        <div className="form-group form-check">
          <input type="checkbox" {...register('includeSwfObject')} id="includeSwfObject" />
          <label htmlFor="includeSwfObject">Automatically include SWFObject for hand-coded Flash support</label>
        </div>
      </S.CheckBoxWrapper>

      <S.ButtonsSectionWrapper>
        <S.Button type="submit">Salvar</S.Button>
      </S.ButtonsSectionWrapper>
    </form>
  </S.CodeWrapper>);
};