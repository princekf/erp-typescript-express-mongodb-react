import * as chalk from 'chalk';
import Item from '../server/items/item.model';
import User from '../server/users/user.model';

const populateDatabase = async() => {

  try {

    const users = await User.find({});
    const items = await Item.find({});
    if (users.length === 0 && items.length === 0) {

      console.warn(chalk.yellow('No users or items in the database, creating sample data...'));
      const user = new User();
      user.email = 'testerp@xpeditions.in';
      user.setPassword('Simple_123');
      await user.save();
      console.warn(chalk.green('Sample user successfuly created!'));
      const newItems = [
        {
          name: 'Paper clip',
          value: 0.1,
        },
        {
          name: 'Colorful pen',
          value: 1.2,
        },
        {
          name: 'Notebook',
          value: 2.5,
        },
        {
          name: 'Soft eraser',
          value: 0.5,
        },
        {
          name: 'Table lamp',
          value: 5.1,
        },
      ];
      await Item.insertMany(newItems);
      console.warn(chalk.green(`${newItems.length} item(s) successfuly created!`));

    } else {

      console.warn(chalk.yellow('Database already initiated, skipping populating script'));

    }

  } catch (error) {

    console.warn(chalk.red(error));

  }

};

export default populateDatabase;
