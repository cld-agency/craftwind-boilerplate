<?php

namespace cld\redirects\records;

use craft\db\ActiveRecord;
use yii\validators\UniqueValidator;

class RedirectRecord extends ActiveRecord
{
    public static function tableName(): string
    {
        return '{{%redirects}}';
    }

    public function rules(): array
    {
        return [
            [['sourceUri', 'destinationUri'], 'required'],
            [['sourceUri', 'destinationUri'], 'string', 'max' => 255],
            ['sourceUri', UniqueValidator::class, 'message' => 'A redirect with this source URI already exists.'],
        ];
    }
}
