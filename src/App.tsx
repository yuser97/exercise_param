import React from 'react';
import './App.css';

interface Param {
  id: number;
  name: string;
  type: 'string';
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
}

interface Props {
  params: Param[];
  model: Model;
}

interface State {
  paramValues: ParamValue[];
  lastModel: Model | null; 
}

class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      paramValues: [...props.model.paramValues],
      lastModel: null, 
    };
  }

  handleParamChange = (paramId: number, value: string) => {
    this.setState(prevState => {
      const existingParam = prevState.paramValues.find(p => p.paramId === paramId);
      
      if (existingParam) {
        return {
          ...prevState,
          paramValues: prevState.paramValues.map(p =>
            p.paramId === paramId ? { ...p, value } : p
          ),
        };
      } else {
        return {
          ...prevState,
          paramValues: [...prevState.paramValues, { paramId, value }],
        };
      }
    });
  };

  public getModel(): Model {
    return {
      paramValues: [...this.state.paramValues],
    };
  }

  // Проверка изменений
  handleCheckChanges = () => {
    const currentModel = this.getModel();
    console.log('Текущая модель:', currentModel); 
    this.setState({ lastModel: currentModel });   
  };

  render() {
    const { params } = this.props;
    const { paramValues, lastModel } = this.state;

    return (
      <div className='app-container'>
        <div className='app_gap'>
          {params.map(param => {
            const paramValue = paramValues.find(p => p.paramId === param.id);
            const value = paramValue ? paramValue.value : '';

            return (
              <div key={param.id} className='param-row'>
                <div className='param_center'>
                  <label className='param_label'>{param.name}</label>
                </div>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => this.handleParamChange(param.id, e.target.value)}
                  className='param_input'
                />
              </div>
            );
          })}
        </div>

        <button onClick={this.handleCheckChanges} className='check-button'>
          Проверить изменения
        </button>

        {lastModel && (
          <div className='model-display'>
            <h3>Текущая модель:</h3>
            <pre>{JSON.stringify(lastModel, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  }
}

const App: React.FC = () => {
  const params: Param[] = [
    {
      id: 1,
      name: "Назначение",
      type: 'string',
    },
    {
      id: 2,
      name: "Длина",
      type: 'string',
    },
  ];

  const model: Model = {
    paramValues: [
      {
        paramId: 1,
        value: "повседневное",
      },
      {
        paramId: 2,
        value: "макси",
      },
    ],
  };

  return <ParamEditor params={params} model={model} />;
};

export default App;