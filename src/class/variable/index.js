import AnswerVariable from './answerVariable';
import ListVariable from './listVariable';
import SlideVariable from './slideVariable';
import TimerVariable from './timerVariable';
import Variable from './variable';

Entry.Variable = Variable;
Entry.Variable.create = (variableMetadata) => {
    const { variableType } = variableMetadata;
    switch (variableType) {
        case 'answer':
            return new AnswerVariable(variableMetadata);
        case 'list':
            return new ListVariable(variableMetadata);
        case 'slide':
            return new SlideVariable(variableMetadata);
        case 'timer':
            return new TimerVariable(variableMetadata);
        case 'variable':
        default:
            return new Variable(variableMetadata);
    }
};
