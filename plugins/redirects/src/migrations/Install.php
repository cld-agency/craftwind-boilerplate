<?php

namespace cld\redirects\migrations;

use craft\db\Migration;

class Install extends Migration
{
    public function safeUp(): bool
    {
        $this->createTable('{{%redirects}}', [
            'id' => $this->primaryKey(),
            'sourceUri' => $this->string(255)->notNull(),
            'destinationUri' => $this->string(255)->notNull(),
            'dateCreated' => $this->dateTime()->notNull(),
            'dateUpdated' => $this->dateTime()->notNull(),
            'uid' => $this->uid(),
        ]);

        $this->createIndex(null, '{{%redirects}}', ['sourceUri'], true);

        return true;
    }

    public function safeDown(): bool
    {
        $this->dropTableIfExists('{{%redirects}}');

        return true;
    }
}
