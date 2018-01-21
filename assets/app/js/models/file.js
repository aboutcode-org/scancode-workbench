/*
 #
 # Copyright (c) 2018 nexB Inc. and others. All rights reserved.
 # https://nexb.com and https://github.com/nexB/scancode-toolkit/
 # The ScanCode software is licensed under the Apache License version 2.0.
 # AboutCode is a trademark of nexB Inc.
 #
 # You may not use this software except in compliance with the License.
 # You may obtain a copy of the License at: http://apache.org/licenses/LICENSE-2.0
 # Unless required by applicable law or agreed to in writing, software distributed
 # under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 # CONDITIONS OF ANY KIND, either express or implied. See the License for the
 # specific language governing permissions and limitations under the License.
 #
 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        'files',
        {
            path: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            parent: DataTypes.STRING,
            type: DataTypes.STRING,
            name: DataTypes.STRING,
            extension: DataTypes.STRING,
            date: DataTypes.STRING,
            size: DataTypes.INTEGER,
            sha1: DataTypes.STRING,
            md5: DataTypes.STRING,
            files_count: DataTypes.INTEGER,
            mime_type: DataTypes.STRING,
            file_type: DataTypes.STRING,
            programming_language: DataTypes.STRING,
            is_binary: DataTypes.BOOLEAN,
            is_text: DataTypes.BOOLEAN,
            is_archive: DataTypes.BOOLEAN,
            is_media: DataTypes.BOOLEAN,
            is_source: DataTypes.BOOLEAN,
            is_script: DataTypes.BOOLEAN
        },
        {
            timestamps: false
        });
};