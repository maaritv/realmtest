import { View, FlatList, StyleSheet, Text, ScrollView } from 'react-native';
import { Realm } from '@realm/react';

import { Task } from '../models/Task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Realm.Results<Task> | [];
  onToggleTaskStatus: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

function TaskList({ tasks, onToggleTaskStatus, onDeleteTask }: TaskListProps) {

  const Task = ({ task }) => {

    console.log("item is " + task)

    return (<TaskItem
      description={task.description}
      isComplete={task.isComplete}
      onToggleStatus={() => onToggleTaskStatus(task)}
      onDelete={() => onDeleteTask(task)}
    // Don't spread the Realm item as such: {...item}
    />)
  }

  console.log(tasks)
  return (
    <View style={styles.listContainer}>
      <ScrollView>
        {tasks.map(task => <Task task={task}/>)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1
  },
  taskItem: {
    height: 55,
    fontSize: 15
  }
});

export default TaskList;
